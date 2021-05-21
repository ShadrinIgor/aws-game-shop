import {catalogBatchProcess} from '../handler';
import {Client} from 'pg';

jest.mock('pg', () => {
    const mClient = {
        connect: jest.fn(),
        query: jest.fn(() => ({rows: [{id: '1'}]})),
        end: jest.fn(),
    };
    return {Client: jest.fn(() => mClient)};
});

jest.mock('process', () => {
    env: {
        SNS_ARN: ''
    }
});

jest.mock('aws-sdk', () => {
    return {
        SNS: jest.fn(() => ({
                publish: jest.fn(() => ({
                        promise: jest.fn(() => new Promise((resolve) => resolve('')))
                    })
                )
            })
        )
    }
});

describe('Check catalog batch process', () => {
    test('get list', async () => {
        let client = new Client();
        const product = {title: 'title', description: 'description', price: 100};
        const insertSQL = `insert into products (title, price, description)
                           values ('${product.title}', '${product.description}', '${product.price}') RETURNING id`;
        const event = {
            Records: [{
                body: JSON.stringify(product)
            }]
        };
        await catalogBatchProcess(event);

        expect(client.connect).toBeCalledTimes(1);
        expect(client.query).toBeCalledWith(insertSQL);
        expect(client.end).toBeCalledTimes(1);
    });
});
