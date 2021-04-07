import {handlerPath} from '@libs/handlerResolver';

export default {
    handler: `${handlerPath(__dirname)}/handler.getProductById`,
    events: [
        {
            http: {
                method: 'get',
                path: 'products/{productId}'
            }
        }
    ]
}
