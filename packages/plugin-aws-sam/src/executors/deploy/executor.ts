import { ExecutorContext } from '@nx/devkit';
import { DeployExecutorSchema } from './schema';
import { join } from 'path';
import { deploy } from '../../utils/sam';

export default async function runExecutor(
  options: DeployExecutorSchema,
  context: ExecutorContext
) {
  const configFile = join(context.root, options.config);
  const templateFile = join(context.root, options.template);
  return await deploy({
    configFile,
    templateFile
  });
}
