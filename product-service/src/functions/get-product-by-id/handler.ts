import 'source-map-support/register';
import {formatJSONResponse} from "../../libs/apiGateway";
import DbService from '../../services/db-service';
import {Client} from 'pg';
import {dbOptions} from "../../constants/db-options";

const dbService = new DbService();

export const getProductById = async (event) => {

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
        let result = {}
        let statusCode = 200;
        const productId: string = event.pathParameters?.productId;
        console.log('getProductById.id', productId);
        if (!productId) {
            statusCode = 422
        } else {
            const product = await dbService.getProductById(client, productId);
            if (product) {
                result = {
                    product
                };
            } else {
                statusCode = 404;
            }
        }

        return formatJSONResponse(statusCode, result);
    } catch (e) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({message: 'Error happened'}),
        };
    }
}
