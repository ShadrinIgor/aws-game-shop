import * as AWS from 'aws-sdk';

import 'source-map-support/register';
import {formatJSONResponse} from "../../libs/apiGateway";

const BUCKET = 'game-store-uploaded';
const INCORRECT_DATA = 'INCORRECT_DATA';
const ERROR_HAPPENED = 'ERROR_HAPPENED';
const APPROVED_EXTENSIONS = ['csv'];

export const importProductsFile = async (event) => {
    const fileName = event?.queryStringParameters?.name;

    if(!fileName) {
        return formatJSONResponse(422, { error: INCORRECT_DATA})
    }

    const fileParams = fileName.split('.');
    const lastParam = fileParams[fileParams.length-1];
    console.log('fileParams', fileParams, !APPROVED_EXTENSIONS.includes(lastParam));
    if (!fileParams || fileParams.length === 1 || !APPROVED_EXTENSIONS.includes(lastParam)) {
        return formatJSONResponse(422, { error: INCORRECT_DATA})
    }

    try {
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
    } catch (e) {
        return formatJSONResponse(422, ERROR_HAPPENED)
    }
}

