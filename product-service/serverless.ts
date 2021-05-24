import type {AWS} from '@serverless/typescript';

import getProductsList from '@functions/get-products-list';
import getProductById from '@functions/get-product-by-id';
import createProduct from '@functions/create-product';
import catalogBatchProcess from '@functions/catalog-batch-process';

const serverlessConfiguration: AWS = {
    service: 'product-service',
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
        region: 'us-east-1',
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            PG_HOST: '***.rds.amazonaws.com',
            PG_PORT: '5432',
            PG_DATABASE: 'mydb',
            PG_USERNAME: '***',
            PG_PASSWORD: '***',
            SQS_URL: {
                Ref: 'SQSCatalogItemsQueue'
            },
            SNS_ARN: {
                Ref: 'SNSCreateProductTopic'
            }
        },
        lambdaHashingVersion: '20201221',
        iam: {
            role: {
                statements: [
                    {
                        Effect: 'Allow',
                        Action: ['sqs:*'],
                        Resource: {
                            'Fn::GetAtt': ['SQSCatalogItemsQueue', 'Arn']
                        }
                    },
                    {
                        Effect: 'Allow',
                        Action: ['sns:*'],
                        Resource: {
                            Ref: 'SNSCreateProductTopic'
                        }
                    }
                ]
            }
        },
    },
    resources: {
        Resources: {
            SQSCatalogItemsQueue: {
                Type: 'AWS::SQS::Queue',
                Properties: {
                    QueueName: 'catalogItemsQueue'
                }
            },
            SNSCreateProductTopic: {
                Type: 'AWS::SNS::Topic',
                Properties: {
                    TopicName: 'createProductTopic'
                }
            },
            SNSSubscription: {
                Type: 'AWS::SNS::Subscription',
                Properties: {
                    Endpoint: '***@epam.com',
                    Protocol: 'email',
                    TopicArn: {
                        Ref: 'SNSCreateProductTopic'
                    }
                }
            },
            SNSCatalogBatchProcessSubscriptionLowCount: {
                Type: 'AWS::SNS::Subscription',
                Properties: {
                    Endpoint: '***@epam.com',
                    Protocol: 'email',
                    TopicArn: {
                        Ref: 'SNSCreateProductTopic',
                    },
                    FilterPolicy: {
                        products_count: [{ numeric: ['<=', 10] }],
                    },
                },
            },
            SNSCatalogBatchProcessSubscriptionHighrCount: {
                Type: 'AWS::SNS::Subscription',
                Properties: {
                    Endpoint: '***@epam.com',
                    Protocol: 'email',
                    TopicArn: {
                        Ref: 'SNSCreateProductTopic',
                    },
                    FilterPolicy: {
                        products_count: [{ numeric: ['>', 10] }],
                    },
                },
            },
        },
    },
    functions: {getProductById, getProductsList, createProduct, catalogBatchProcess},

};

module.exports = serverlessConfiguration;
