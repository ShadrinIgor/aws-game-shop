'use strict';

module.exports.hello = async (event) => {
    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                productName: 'Game 1',
                price: 123
            },
            null,
            2
        ),
    };
};
