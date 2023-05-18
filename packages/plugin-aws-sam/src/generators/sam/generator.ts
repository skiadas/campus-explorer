import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  Tree
} from '@nx/devkit';
import * as path from 'path';
import { SamGeneratorSchema } from './schema';

export default async function (tree: Tree, options: SamGeneratorSchema) {
  const projectRoot = `packages/${options.name}`;
  addProjectConfiguration(tree, options.name, {
    root: projectRoot,
    projectType: 'application',
    sourceRoot: `${projectRoot}/src`,
    targets: {
      build: {
        executor: '@campus-explorer/plugin-aws-sam:build',
        outputs: ['{options.outputPath}'],
        options: {
          outputPath: `dist/packages/${options.name}`,
          template: `${projectRoot}/template.yaml`,
          config: `${projectRoot}/samconfig.toml`,
        },
      },
      deploy: {
        executor: '@campus-explorer/plugin-aws-sam:deploy',
        outputs: ['{options.outputPath}'],
        options: {
          outputPath: `dist/packages/${options.name}`,
          template: `dist/packages/${options.name}/template.yaml`,
          config: `${projectRoot}/samconfig.toml`,
        },
      },
    },
  });
  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, options);
  await formatFiles(tree);
}
