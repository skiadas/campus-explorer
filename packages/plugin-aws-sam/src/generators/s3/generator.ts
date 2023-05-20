import {
  readProjectConfiguration,
  Tree,
} from '@nx/devkit';
import { S3GeneratorSchema } from './schema';
import { readTemplate } from '../../utils/info';
import { s3Template } from '../../utils/templates';

export default async function (tree: Tree, options: S3GeneratorSchema) {
  const projectConfig = readProjectConfiguration(tree, options.project);
  const template = readTemplate(tree, projectConfig.root);
  template.throwIfResourcePresent(options.name);

  template.mergeResource(s3Template(options.name));
}

