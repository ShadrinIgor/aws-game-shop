import {getProductsList} from '../handler';

describe('Check get products list',  () => {
    test('get list', async () => {
        const result: any = await getProductsList();
        const body = JSON.parse(result.body);
        expect(result.statusCode).toEqual(200);
        expect(body.products.length).toEqual(6);
    });
});
