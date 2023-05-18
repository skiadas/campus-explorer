import { addDependenciesToPackageJson, Tree } from '@nx/devkit';
import { libraryGenerator } from '@nx/js';
import { join } from 'path';
import { FunctionGeneratorSchema } from './schema';
import {
  ProjectConfiguration,
  readProjectConfiguration,
  updateProjectConfiguration,
} from 'nx/src/devkit-exports';
import {
  lambdaTemplate,
  merge,
  loadYAML,
  writeYAML,
} from '../../utils/templates';

export default async function (tree: Tree, options: FunctionGeneratorSchema) {
  const projectConfig = readProjectConfiguration(tree, options.project);
  const templatePath = join(projectConfig.root, 'template.yaml');
  let template = loadYAML(tree.read, templatePath);
  if (options.name in template.Resources) {
    throw new Error(
      `A component named ${options.name} already exists in the template.`
    );
  }
  const info = await ensureLibraryResource(
    options.project,
    tree,
    projectConfig
  );

  addLambdaDependencies(tree);
  appendToFile(tree, info.codefile, getFunctionBody(`handle${options.name}`));
  template = merge(template, lambdaTemplate(options.name, info.root));

  writeYAML(tree.write, templatePath, template);
}

async function ensureLibraryResource(project: string, tree: Tree, projectConfig: ProjectConfiguration) {
  const libraryName = `${project}-lib`;
  const libraryInfo = await readOrCreateLibrary(tree, libraryName);

  projectConfig.implicitDependencies ??= [];
  if (!projectConfig.implicitDependencies.includes(libraryName)) {
    console.log(`Adding library dependency to project: ${project}`);
    projectConfig.implicitDependencies.push(libraryName);
  }
  updateProjectConfiguration(tree, project, projectConfig);
  return {
    codefile: join(libraryInfo.sourceRoot, 'lib', `${libraryName}.ts`),
    root: libraryInfo.root
  };
}

function addLambdaDependencies(tree: Tree) {
  addDependenciesToPackageJson(
    tree,
    {},
    { '@types/aws-lambda': 'latest', esbuild: 'latest' }
  );
}

async function readOrCreateLibrary(tree: Tree, libraryName: string) {
  try {
    return readProjectConfiguration(tree, libraryName);
  } catch (e) {
    console.info(
      `Associated library ${libraryName} not found. Creating .... You will need to rerun your task.`
    );
    await libraryGenerator(tree, {
      name: libraryName,
      bundler: 'vite',
      unitTestRunner: 'vitest',
    });
    return readProjectConfiguration(tree, libraryName);
  }
}

function getFunctionBody(handlerName) {
  return `
export const ${handlerName} = async (event: APIGatewayProxyEvent, context: any): Promise<APIGatewayProxyResult> => {
  try {
    return {
      statusCode: 200,
      headers,
      body: '{ "message": "OK" }',
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: 'some error happened',
      }),
    };
  }
};`;
}

// Appends contents to the file. It will first look for the file in
// the pending changes, and it will amend the change. Otherwise
// It will search for the file in the real path, and will schedule an
// update to that file

function appendToFile(
  tree: Tree,
  filepath: string,
  contentToAdd: string
): void {
  const oldContent = tree.read(filepath);
  const newContent = Buffer.concat([
    oldContent,
    Buffer.from(contentToAdd, 'utf8'),
  ]);
  tree.write(filepath, newContent);
}
