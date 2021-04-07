import {getProductById} from '../handler';

describe('Check get product by id',  () => {
    test('without id', async () => {
        const event = {
            pathParameters: {
                productId: ""
            }
        };
        const result: any = await getProductById(event);
        expect(result.statusCode).toEqual(422);
    });
    test('with incorrect id', async () => {
        const event = {
            pathParameters: {
                productId: 123
            }
        };
        const result: any = await getProductById(event);
        expect(result.statusCode).toEqual(404);
    });
    test('with correct id', async () => {
        const productId = 1;
        const event = {
            pathParameters: {
                productId
            }
        };
        const result: any = await getProductById(event);
        const body = JSON.parse(result.body);
        expect(body?.product?.id).toEqual(productId);
    });
});
