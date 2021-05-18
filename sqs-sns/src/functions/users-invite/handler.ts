import 'source-map-support/register';
import {SNS} from "aws-sdk";

export const usersInvite = async (event: any) => {
    const users = event?.Records.map(({body}) => body);
    console.log('users', users);
    const sns = new SNS({region: 'us-east-1'})

    sns.publish({
        Subject: 'You are invited',
        Message: JSON.stringify(users),
        TopicArn: process.env.SNS_ARN
    }, () => {
        console.log('sent email to: ', JSON.stringify(users));
    });

    const res = await sns.publish({
        Subject: 'You are invited2',
        Message: JSON.stringify(users),
        TopicArn: process.env.SNS_ARN
    }).promise();

    console.log('res', res);
}
