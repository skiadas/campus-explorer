import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import generator from './generator';
import { S3GeneratorSchema } from './schema';

describe.skip('s3 generator', () => {
  let tree: Tree;
  const options: S3GeneratorSchema = { name: 'test', project: 'something' };

  // beforeEach(() => {
  //   tree = createTreeWithEmptyWorkspace();
  // });

  it('should run successfully', async () => {
    // await generator(tree, options);
    // const config = readProjectConfiguration(tree, 'test');
    // expect(config).toBeDefined();
  });
});
