import 'source-map-support/register';


import {formatJSONResponse} from '../../libs/apiGateway';
import DbService from '../../services/db-service';
import {dbOptions} from '../../constants/db-options';
import {Client} from 'pg';


const dbService = new DbService();

export const createProduct = async (request) => {
    const invalidDataError = 'DATA_IS_INVALID';
    const productsFields = ['title', 'price', 'description', 'image'];
    let client;

    try {
        client = new Client(dbOptions);
        await client.connect();
    } catch (e) {
        console.log('e', e);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({message: 'Error DB connection'}),
        };
    }

    try {
        const requestBody = JSON.parse(request.body);
        console.log('createProduct.body', requestBody);

        if (requestBody && requestBody.title && +requestBody.price && requestBody.description && requestBody.count) {
            const {title, price, description, count, image} = requestBody;
            const postParams = [title, price, description, image || ''];

            try {
                await client.query('BEGIN')
                const newProductId = await dbService.createNewItemInTable(client, dbService.PRODUCTS_TABLE, productsFields, postParams);
                await dbService.createNewItemInStocks(client, newProductId, count);
                await client.query('COMMIT')
            } catch (e) {
                await client.query('ROLLBACK')
                throw e
            }

            return formatJSONResponse(200, {
                insertStatus: true
            });
        } else {
            return formatJSONResponse(400, {
                message: invalidDataError
            });
        }


    } catch (e) {
        console.log('e', e);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({message: 'Error happened'}),
        };
    } finally {
        client.end();
    }
}

