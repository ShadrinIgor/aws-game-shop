import * as AWS from 'aws-sdk';
import {S3} from 'aws-sdk';
import * as stream from 'stream';
import * as csv from 'csv-parser';

import 'source-map-support/register';
import {formatJSONResponse} from "../../libs/apiGateway";

const s3 = new AWS.S3({
    region: 'us-east-1',
    signatureVersion: 'v4'
});

const UPLOAD_FOLDER = 'uploaded';
const PARSED_FOLDER = 'parsed';

// const dbService = new DbService();
const BUCKET = 'game-store-uploaded';
const ERROR_HAPPENED = 'ERROR_HAPPENED';

export const importFileParser = async (event) => {
    console.log('importProductsFile');

    await parseFiles(event);

    await moveFilesToParsed(event);

    return formatJSONResponse(200, {message: 200})
}

/**
 * Parse file front event
 * @param event
 */
async function parseFiles(event) {
    console.log('parseFiles');
    try {
        for (const record of event.Records) {
            const recordKey = record.s3.object.key;
            console.log('parseFiles.file', recordKey);
            const s3Object = await s3.getObject({
                Bucket: BUCKET,
                Key: recordKey
            }).promise();

            const objectStream = new stream.Readable();
            objectStream._read = () => {
            };
            objectStream.push((s3Object as S3.Types.GetObjectOutput).Body);

            objectStream
                .pipe(csv())
                .on('data', async function (data) {
                        this.pause();
                        console.log('stream.data', data);
                        this.resume();
                    }
                )
                .on('end', async function () {
                        this.pause();
                        console.log('stream.end');
                    }
                )

        }
    } catch (e) {
        return formatJSONResponse(422, ERROR_HAPPENED)
    }
}

/**
 * Move parsed files in the folder 'parsed/'
 * @param event
 */
function moveFilesToParsed(event) {
    const objectsCount = event.Records.length;
    let deletedCount = 0;

    return new Promise(async (resolve) => {
        for (const record of event.Records) {
            const parsedObjectKey = record.s3.object.key.replace(UPLOAD_FOLDER, PARSED_FOLDER);
            console.log('moveIntoToParsed', record.s3.object.key, ' - ', record.s3.object.key.replace(UPLOAD_FOLDER, PARSED_FOLDER));
            await s3.copyObject({
                Bucket: BUCKET,
                CopySource: `${BUCKET}/${record.s3.object.key}`,
                Key: parsedObjectKey
            }).promise();

            console.log('deleteObject', record.s3.object.key);
            s3.deleteObject({
                Bucket: BUCKET,
                Key: record.s3.object.key,
            }, (err, data) => {
                deletedCount++;

                if (err) {
                    console.log('deleteObject.error', err, err.stack);
                }
                console.log('deleteObject.success', deletedCount, ' from ', objectsCount, ';', data);
                if (deletedCount === objectsCount) {
                    resolve(null);
                }
            });
        }
    });

}
