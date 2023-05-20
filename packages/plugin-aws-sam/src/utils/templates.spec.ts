import { lambdaTemplate, loadYAML, s3Template } from './templates';
import { dump } from 'js-yaml';
import * as fs from 'fs';
import { createTree, createTreeWithEmptyWorkspace } from 'nx/src/devkit-testing-exports';
import { FsTree } from 'nx/src/generators/tree';

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
  it('s3BucketWorks', () => {
    expect(dump(s3Template('testBucket'))).toEqual(
      `Resources:
  testBucket:
    Type: AWS::S3::Bucket
    Properties:
      PublicAccessBlockConfiguration:
        BlockPublicAcls: false
        BlockPublicPolicy: false
        IgnorePublicAcls: false
        RestrictPublicBuckets: false
    OwnershipControls:
      Rules:
        - ObjectOwnership: ObjectWriter
  testBucketPolicy:
    Type: AWS::S3::BucketPolicy
    Properties:
      Bucket: '!Ref testBucket'
      PolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal: '*'
            Action: s3:GetObject
            Resource: '!Sub ''arn:aws:s3:::\${testBucket}/*'''
Outputs:
  testBucketName:
    Description: Assigned name for testBucket
    Value: '!Ref testBucket'
  testBucketArn:
    Description: testBucket ARN
    Value: '!GetAtt testBucket.Arn'
  testBucketDomainName:
    Description: Domain name for testBucket
    Value: '!GetAtt testBucket.DomainName'
  testBucketWebsiteURL:
    Description: WebsiteURL for testBucket
    Value: '!GetAtt testBucket.WebsiteURL'
`
    );
  });
});
