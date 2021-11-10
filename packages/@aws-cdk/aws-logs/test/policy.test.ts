import '@aws-cdk/assert-internal/jest';
import { PolicyStatement, ServicePrincipal } from '@aws-cdk/aws-iam';
import { Stack } from '@aws-cdk/core';
import { LogGroup, ResourcePolicy } from '../lib';

describe('resource policy', () => {
  test('ResourcePolicy is added to stack, when .addToResourcePolicy() is provided a valid Statement', () => {
    // GIVEN
    const stack = new Stack();
    const logGroup = new LogGroup(stack, 'LogGroup');

    // WHEN
    logGroup.addToResourcePolicy(new PolicyStatement({
      actions: ['logs:CreateLogStream'],
      resources: ['*'],
    }));

    // THEN
    expect(stack).toHaveResource('AWS::Logs::ResourcePolicy', {
      PolicyName: 'LogGroupPolicy643B329C',
      PolicyDocument: JSON.stringify({
        Statement: [
          {
            Action: 'logs:CreateLogStream',
            Effect: 'Allow',
            Resource: '*',
          },
        ],
        Version: '2012-10-17',
      }),
    });
  });

  test('ResourcePolicy is added to stack, when created manually/directly', () => {
    // GIVEN
    const stack = new Stack();
    const logGroup = new LogGroup(stack, 'LogGroup');

    // WHEN
    const resourcePolicy = new ResourcePolicy(stack, 'ResourcePolicy');
    resourcePolicy.document.addStatements(new PolicyStatement({
      actions: ['logs:CreateLogStream', 'logs:PutLogEvents'],
      principals: [new ServicePrincipal('es.amazonaws.com')],
      resources: [logGroup.logGroupArn],
    }));

    // THEN
    expect(stack).toHaveResource('AWS::Logs::ResourcePolicy', {
      PolicyName: 'ResourcePolicy',
    });
  });
});
