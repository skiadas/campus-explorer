import { lambdaTemplate } from './templates';
import { dump } from 'js-yaml';
describe('templates', () => {
  it('lambdaTemplate works', () => {
    expect(dump(lambdaTemplate('test', 'theRoot'))).toEqual(
`Resources:
  test:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: theRoot
      Handler: index.handletest
      Runtime: nodejs18.x
      Architectures:
        - x86_64
    Metadata:
      BuildMethod: esbuild
      BuildProperties:
        Minify: true
        Target: es2020
        Sourcemap: true
        EntryPoints:
          - src/index.ts
Outputs:
  test:
    Description: test ARN
    Value: '!GetAtt test.Arn'
  testIamRole:
    Description: Implicit IAM Role created for test
    Value: '!GetAtt testRole.Arn'
`
  );
  });
});
