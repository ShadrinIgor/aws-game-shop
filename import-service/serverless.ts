import type {AWS} from '@serverless/typescript';
import importProductsFile from "./src/functions/import-products-file";
import importFileParser from "./src/functions/import-file-parser";

const IMPORT_BUCKET_NAME = 'game-store-uploaded';

const serverlessConfiguration: AWS = {
    service: 'import-service',
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
            PG_HOST: 'mydb.cxdn0u6xwgem.us-east-1.rds.amazonaws.com',
            PG_PORT: '5432',
            PG_DATABASE: 'mydb',
            PG_USERNAME: 'postgres',
            PG_PASSWORD: 'pA6r5nou77OIPtVqSU8d',
        },
        lambdaHashingVersion: '20201221',
        iam: {
            role: {
                statements: [
                    {
                        Effect: 'Allow',
                        Action: ['s3:ListBucket'],
                        Resource: `arn:aws:s3:::${IMPORT_BUCKET_NAME}`,
                    },
                    {
                        Effect: 'Allow',
                        Action: ['s3:PutObject'],
                        Resource: `arn:aws:s3:::${IMPORT_BUCKET_NAME}`,
                    },
                    {
                        Effect: 'Allow',
                        Action: ['s3:DeleteObject'],
                        Resource: `arn:aws:s3:::${IMPORT_BUCKET_NAME}`,
                    },
                    {
                        Effect: 'Allow',
                        Action: ['s3:*'],
                        Resource: `*`,
                        // Resource: `arn:aws:s3:::${IMPORT_BUCKET_NAME}/*`,
                    }
                ],
            }
        },
        iamRoleStatements: [
            {
                Effect: 'Allow',
                Action: ['s3:ListBucket'],
                Resource: 'arn:aws:s3:::game-store-uploaded',
            },
            {
                Effect: 'Allow',
                Action: ['s3:*'],
                Resource: 'arn:aws:s3:::game-store-uploaded/*',
            }
        ],
    },
    // import the function via paths
    functions: {importProductsFile, importFileParser},
};

module.exports = serverlessConfiguration;
