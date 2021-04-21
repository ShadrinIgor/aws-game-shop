import 'source-map-support/register';

import {formatJSONResponse} from '../../libs/apiGateway';
import DbService from '../../services/db-service';
import {Client} from 'pg';
import {dbOptions} from "../../constants/db-options";

const dbService = new DbService();


export const getProductsList = async () => {

    console.log('getProductsList');
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
        await dbService.insertInitialDataIfNeed(client);
        const products = await dbService.getAllProductsWithCount(client);
        return formatJSONResponse(200, {
            products
        });
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

