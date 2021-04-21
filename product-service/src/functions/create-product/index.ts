import {handlerPath} from '@libs/handlerResolver';

export default {
    handler: `${handlerPath(__dirname)}/handler.createProduct`,
    events: [
        {
            http: {
                method: 'post',
                path: 'products'
            }
        }
    ]
}
