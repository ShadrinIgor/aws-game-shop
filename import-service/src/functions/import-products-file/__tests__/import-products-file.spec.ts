import {importProductsFile} from '../handler';

const RETURN_URL = 'https://test.file';

jest.mock('aws-sdk', () => {
    class mockS3 {
        getSignedUrlPromise() {
            return new Promise((resolve) => {
                resolve(RETURN_URL);
            });
        }
    }

    return {
        ...jest.requireActual('aws-sdk'),
        S3: mockS3
    }
});

describe('Import products file',  () => {
    test('Return url', async () => {
        const event = {
            queryStringParameters: {
                name: 'test-file'
            }
        };
        const result: any = await importProductsFile(event);
        expect(result.body).toEqual(RETURN_URL);
        expect(result.statusCode).toEqual(200);
    });
});
