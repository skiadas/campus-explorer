import { load, dump } from 'js-yaml';

export function loadYAML(
  read: (filePath: string, encoding?: BufferEncoding) => Buffer,
  templatePath: string
) {
  try {
    return load(read(templatePath, 'utf8'));
  } catch (e) {
    console.error('Could not process template file at: ' + templatePath);
    throw e;
  }
}

export function writeYAML(
  write: (path: string, contents: Buffer) => void,
  templatePath: string,
  template: any
): void {
  write(templatePath, dump(template));
}

export function merge(template: any, additions: any): any {
  const { Resources, Outputs, ...rest } = template;
  return {
    ...rest,
    Resources: { ...Resources, ...additions.Resources },
    Outputs: { ...Outputs, ...additions.Outputs },
  };
}
export function lambdaTemplate(name: string, codeRoot: string) {
  return {
    Resources: {
      [name]: {
        Type: 'AWS::Serverless::Function',
        Properties: {
          CodeUri: codeRoot,
          Handler: `index.handle${name}`,
          Runtime: 'nodejs18.x',
          Architectures: ['x86_64'],
        },
        Metadata: {
          BuildMethod: 'esbuild',
          BuildProperties: {
            Minify: true,
            Target: 'es2020',
            Sourcemap: true,
            EntryPoints: ['src/index.ts'],
          },
        },
      },
    },
    Outputs: {
      [name]: {
        Description: `${name} ARN`,
        Value: `!GetAtt ${name}.Arn`,
      },
      [`${name}IamRole`]: {
        Description: `Implicit IAM Role created for ${name}`,
        Value: `!GetAtt ${name}Role.Arn`,
      },
    },
  };
}

export function s3Template() {}
