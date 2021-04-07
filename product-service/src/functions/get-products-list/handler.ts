import 'source-map-support/register';

import {formatJSONResponse} from '../../libs/apiGateway';
import {Products} from '../../products/products';

export const getProductsList = async () => {
    try {
        return formatJSONResponse(200, {
            products: Products
        });
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

