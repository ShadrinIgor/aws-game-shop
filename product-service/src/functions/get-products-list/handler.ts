import 'source-map-support/register';

import {formatJSONResponse} from '../../libs/apiGateway';
import {Products} from '../../products/products';

export const getProductsList = async () => {
    return formatJSONResponse(200, {
        products: Products
    });
}

