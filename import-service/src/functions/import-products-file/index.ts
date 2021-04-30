import {handlerPath} from "../../libs/handlerResolver";

export default {
    handler: `${handlerPath(__dirname)}/handler.importProductsFile`,
    events: [
        {
            http: {
                method: 'get',
                path: 'import',
                request: {
                    method: 'get',
                    parameters: {
                        querystrings: {
                            name: {
                                required: true
                            }
                        }
                    }
                }
            }
        }
    ]
}
