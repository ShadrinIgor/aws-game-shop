import type { AWS } from '@serverless/typescript';

import getProductsList from '@functions/get-products-list';
import getProductById from '@functions/get-product-by-id';
import createProduct from '@functions/create-product';

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
      PG_HOST: 'mydb.cxdn0u6xwgem.us-east-1.rds.amazonaws.com',
      PG_PORT: '5432',
      PG_DATABASE: 'mydb',
      PG_USERNAME: 'postgres',
      PG_PASSWORD: 'pA6r5nou77OIPtVqSU8d',
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { getProductById, getProductsList, createProduct },
};

module.exports = serverlessConfiguration;
