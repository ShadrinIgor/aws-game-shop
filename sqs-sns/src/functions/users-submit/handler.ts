import 'source-map-support/register';

import type {ValidatedEventAPIGatewayProxyEvent} from '@libs/apiGateway';
import {formatJSONResponse} from '@libs/apiGateway';

import schema from './schema';
import {SQS} from "aws-sdk";

export const usersSubmit: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event: any) => {
    const sqs = new SQS();
    const users = event;
    console.log('users', event);
    console.log('process.env.SQS_URL,', process.env.SQS_URL);

    try {
        users.forEach( user => {
            console.log('one-user', user);

            sqs.sendMessage({
                QueueUrl: 'https://sqs.us-east-1.amazonaws.com/168932017295/sqs-sns',// process.env.SQS_URL,
                MessageBody: user
            }, (err, data) => {
                if (!err) {
                    console.log('Send message for: ', data);
                } else {
                    console.log('Send message error: ', err);
                }
            });
        });

        const res = await sqs.sendMessage({
            QueueUrl: process.env.SQS_URL,
            MessageBody: 'user'
        }).promise();

        console.log('res', res);

    } catch (e) {
        console.log('e', e);
    }
    return formatJSONResponse({
        message: 200
    });
}
