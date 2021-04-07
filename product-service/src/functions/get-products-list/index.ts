import {handlerPath} from '@libs/handlerResolver';

export default {
    handler: `${handlerPath(__dirname)}/handler.getProductsList`,
    events: [
        {
            http: {
                method: 'get',
                path: 'products'
            }
        }
    ]
}
