import { ExecutorContext } from 'nx/src/devkit-exports';
import { BuildExecutorSchema } from './schema';
import { join } from 'path';
import { build } from '../../utils/sam';

export default async function runExecutor(
  options: BuildExecutorSchema,
  context: ExecutorContext
) {
  const configFile = join(context.root, options.config);
  const buildDir = join(context.root, options.outputPath);
  const templateFile = join(context.root, options.template);
  const baseDir = context.root;
  return await build({
    configFile,
    buildDir,
    templateFile,
    baseDir,
  });
}
