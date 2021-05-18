import type { AWS } from '@serverless/typescript';

import usersInvite from '@functions/users-invite';
import usersSubmit from '@functions/users-submit';

const serverlessConfiguration: AWS = {
  service: 'sqs-sns',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      SQS_URL: {
        Ref: 'SQSQueue'
      },
      SNS_ARN: {
        Ref: 'SNSTopic'
      }
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['sqs:*'],
        Resource: {
          'Fn::GetAtt': ['SQSQueue', 'Arn']
        }
      }
    ],
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: ['sqs:*'],
            Resource: {
              'Fn::GetAtt': ['SQSQueue', 'Arn']
            }
          },
          {
            Effect: 'Allow',
            Action: ['sns:*'],
            Resource: {
              Ref: 'SNSTopic'
            }
          }
        ]
      }
    },
    lambdaHashingVersion: '20201221',
  },
  resources: {
    Resources: {
      SQSQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'sqs-sns'
        }
      },
      SNSTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'sns-topic'
        }
      },
      SNSSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'igor_shadrin@epam.com',
          Protocol: 'email',
          TopicArn: {
            Ref: 'SNSTopic'
          }
        }
      }
    }
  },
  // import the function via paths
  functions: { usersInvite, usersSubmit },
};

module.exports = serverlessConfiguration;
