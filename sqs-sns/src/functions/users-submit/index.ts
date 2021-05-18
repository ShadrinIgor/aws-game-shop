import {handlerPath} from '@libs/handlerResolver';

export default {
    handler: `${handlerPath(__dirname)}/handler.usersSubmit`,
    events: [
        {
            http: {
                method: 'post',
                path: 'users',
            }
        }
    ]
}
