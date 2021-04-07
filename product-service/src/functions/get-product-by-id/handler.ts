import 'source-map-support/register';

import {Products} from '../../products/products';
import {formatJSONResponse} from "../../libs/apiGateway";

export const getProductById = async (event) => {
    let result = {}
    let statusCode = 200;
    const productId = +event.pathParameters?.productId;
    if (!productId) {
        statusCode = 422
    } else {
        const product = Products.find(product => product.id === productId);
        if (product) {
            result = {
                product
            };
        } else {
            statusCode = 404;
        }
    }

    return formatJSONResponse(statusCode, result);
}
