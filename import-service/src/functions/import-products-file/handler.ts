import * as AWS from 'aws-sdk';

import 'source-map-support/register';
import {formatJSONResponse} from "../../libs/apiGateway";

// const dbService = new DbService();
const BUCKET = 'game-store-uploaded';

export const importProductsFile = async (event) => {
    const fileName = event?.queryStringParameters?.name;
    console.log('importProductsFile', fileName);
    const s3 = new AWS.S3({
        region: 'us-east-1',
        signatureVersion: 'v4'
    });

    const params = {
        Bucket: BUCKET,
        Key: `uploaded/${fileName}`,
        Expires: 60,
        ContentType: 'text/csv',
        ACL: 'public-read'
    };

    const url = await s3.getSignedUrlPromise('putObject', params);

    return formatJSONResponse(200, url)
}

