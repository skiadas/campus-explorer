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

export function s3Template(name: string) {
  return {
    Resources: {
      [name]: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          PublicAccessBlockConfiguration: {
            BlockPublicAcls: false,
            BlockPublicPolicy: false,
            IgnorePublicAcls: false,
            RestrictPublicBuckets: false,
          },
        },
        OwnershipControls: {
          Rules: [{ ObjectOwnership: 'ObjectWriter' }],
        },
      },
      [`${name}Policy`]: {
        Type: 'AWS::S3::BucketPolicy',
        Properties: {
          Bucket: `!Ref ${name}`,
          PolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Principal: '*',
                Action: 's3:GetObject',
                Resource: `!Sub 'arn:aws:s3:::\${${name}}/*'`,
              },
            ],
          },
        },
      },
    },
    Outputs: {
      [`${name}Name`]: {
        Description: `Assigned name for ${name}`,
        Value: `!Ref ${name}`,
      },
      [`${name}Arn`]: {
        Description: `${name} ARN`,
        Value: `!GetAtt ${name}.Arn`,
      },
      [`${name}DomainName`]: {
        Description: `Domain name for ${name}`,
        Value: `!GetAtt ${name}.DomainName`,
      },
      [`${name}WebsiteURL`]: {
        Description: `WebsiteURL for ${name}`,
        Value: `!GetAtt ${name}.WebsiteURL`,
      },
    },
  };
}
