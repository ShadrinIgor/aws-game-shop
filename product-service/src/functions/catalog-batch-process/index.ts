import {handlerPath} from '@libs/handlerResolver';

export default {
    handler: `${handlerPath(__dirname)}/handler.catalogBatchProcess`,
    events: [
        {
            sqs: {
                batchSize: 5,
                arn: {
                    'Fn::GetAtt': ['SQSCatalogItemsQueue', 'Arn']
                }
            }
        }
    ]
}
