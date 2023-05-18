import { exec } from 'child_process';
import { promisify } from 'util';

export type CaseTransform = 'none' | 'kebab-case';
export interface ExecuteOptions {
  logStdout?: boolean; // Defaults to true
  logStderr?: boolean; // Defaults to true
  failOnStderr?: boolean; // Fail if there is any output in stderr
  caseTransform?: CaseTransform;
}

export interface ExecuteResult {
  stdout: string;
  stderr: string;
  success: boolean;
}

// type Args = Record<string, string | boolean>;
interface Args {
  [name: string]: string|boolean
}

export interface BuildArgs {
  configFile?: string;
  buildDir?: string;
  templateFile?: string;
  baseDir?: string;
  cached?: boolean;
  noCached?: boolean;
  cacheDir?: string;
  exclude?: string;
  profile?: string;
  region?: string;
  configEnv?: string;
  dockerNetwork?: string;
  parameterOverrides?: string;
  manifest?: string;
  buildImage?: string;
  containerEnvVarFile?: string;
  containerEnvVar?: string;
  hookName?: string;
  skipPrepareInfra?: boolean;
  useContainer?: boolean;
  betaFeatures?: boolean;
  noBetaFeatures?: boolean;
  skipPullImage?: boolean;
  debug?: boolean;
  help?: boolean;
}

// TODO: some of these options are "lists"
// TODO: some booleans have no-versions, should detect somehow?
export interface DeployArgs {
  templateFile?: string;
  stackName?: string;
  s3Bucket?: string;
  s3Prefix?: string;
  imageRepository?: string;
  signingProfiles?: string;
  capabilities?: string;
  region?: string;
  profile?: string;
  kmsKeyKd?: string;
  forceUpload?: string;
  noExecuteChangeset?: boolean;
  roleArn?: string;
  failOnEmptyChangeset?: boolean;
  noFailOnEmptyChangeset?: boolean;
  confirmChangeset?: boolean;
  noConfirmChangeset?: boolean;
  useJson?: boolean;
  resolveS3?: boolean;
  resolveImageRepos?: boolean;
  metadata?: string;
  notificationArns?: string;
  tags?: string;
  parameterOverrides?: string;
  disableRollback?: boolean;
  noDisableRollback?: boolean;
  onFailure?: 'ROLLBACK' | 'DELETE' | 'DO_NOTHING';
  configFile?: string;
  configEnv?: string;
  noProgressbar?: boolean;
  debug?: boolean;
  help?: boolean;
}

const defaultOptions: ExecuteOptions = {
  logStdout: true,
  logStderr: true,
  failOnStderr: false,
  caseTransform: 'kebab-case',
};

// The promise will throw an error if the command returns
// an appropriate error code. You can also make it
export async function execute(
  command: string,
  args: Args = {},
  options: ExecuteOptions = defaultOptions
): Promise<ExecuteResult> {
  options = { ...defaultOptions, ...options };
  command = amendCommand(command, args, options.caseTransform);
  const { stdout, stderr } = await promisify(exec)(command);
  if (options.logStdout) console.log(stdout);
  if (options.logStderr) console.error(stderr);
  return { stdout, stderr, success: options.failOnStderr ? !stderr : true };
}

function amendCommand(
  command: string,
  args: Args,
  caseTransform: CaseTransform
): string {
  return command + objectToArgsString(args, caseTransform);
}

export function objectToArgsString(
  args: Args,
  caseTransform: CaseTransform = 'kebab-case'
) {
  const transform = getTransformFunction(caseTransform);
  return Object.entries(args)
    .map(([key, value]) => {
      if (typeof value == 'boolean') {
        return value ? ` --${transform(key)}` : '';
      }
      return ` --${transform(key)} "${value}"`;
    })
    .join('');
}

function getTransformFunction(
  caseTransform: CaseTransform
): (s: string) => string {
  switch (caseTransform) {
    case 'none':
      return (s) => s;
    case 'kebab-case':
      return (s) => s.replace(/[A-Z]/g, (l) => `-${l.toLowerCase()}`);
  }
}

export async function build(args: Readonly<BuildArgs>) {
  return await execute('sam build', args);
}

export async function deploy(args: Readonly<DeployArgs>) {
  return await execute('sam deploy', args);
}
