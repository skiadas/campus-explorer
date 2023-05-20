import { join } from 'path';
import { loadYAML, writeYAML } from './templates';

interface SystemIO {
  read: (path: string, encoding?: BufferEncoding) => Buffer;
  write: (path: string, contents: Buffer) => void;
}

export function readTemplate(tree: SystemIO, projectRoot: string) {
  return new Template(tree, join(projectRoot, 'template.yaml'));
}

function merge(template: any, additions: any): any {
  const { Resources, Outputs, ...rest } = template;
  return {
    ...rest,
    Resources: { ...Resources, ...additions.Resources },
    Outputs: { ...Outputs, ...additions.Outputs },
  };
}


class Template {
  obj: any;
  path: string;
  tree: SystemIO;
  constructor(tree: SystemIO, path: string) {
    this.tree = tree;
    this.obj = loadYAML(tree.read.bind(tree), path);
    this.path = path;
  }

  mergeResource(newResource: any) {
    this.obj = merge(this.obj, newResource);
    writeYAML(this.tree.write.bind(this.tree), this.path, this.obj);
  }

  throwIfResourcePresent(name: string) {
    if (name in this.obj.Resources) {
      throw new Error(
        `A component named ${name} already exists in the template.`
      );
    }
  }
}
