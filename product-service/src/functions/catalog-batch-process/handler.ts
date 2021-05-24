import {SNS} from "aws-sdk";
import {Client} from 'pg';

import 'source-map-support/register';
import {dbOptions} from "../../constants/db-options";
import DbService from "../../services/db-service";

const dbService = new DbService();
const productsFields = ['title', 'price', 'description'];
let client;

export const catalogBatchProcess = async (event) => {
    console.log('request', event);
    const products = collectProductsFromEvent(event?.Records);
    console.log('request.productCount', products?.length);

    try {
        if (products?.length) {
            await setDBClient();
            await createProducts(products);
            await sendSNQ(products?.length);
        }

    } catch (e) {
        console.log('catalogBatchProcess.error', e);
    } finally {
        client.end();
    }
}

/**
 * Create Products
 * @param products
 */
async function createProducts(products) {
    console.log('createProducts', products);
    try {
        const createPromises = products.map(async product => {
            const newProductId = await dbService.createNewItemInTable(client, dbService.PRODUCTS_TABLE, [...productsFields], [...product]);
            console.log('newProductId: ', newProductId)
        });
        await Promise.all(createPromises);

    } catch (e) {
        console.log('createProducts.error', e);
        throw e
    }
}

/**
 * Send message in SNQ
 * @param countProducts
 */
async function sendSNQ(countProducts: number) {
    console.log('sendSNQ', countProducts);
    const sns = new SNS({region: 'us-east-1'})
    const res = await sns.publish({
        Subject: `Success added ${countProducts} products`,
        Message: `Success added ${countProducts} products`,
        MessageAttributes: {
            products_count: {
                DataType: 'Number',
                StringValue: String(countProducts)
            }
        },
        TopicArn: process.env.SNS_ARN
    }).promise();

    console.log('sendSNQ.res', res);
}

/**
 * Set DB client in global variable CLIENT
 */
async function setDBClient() {
    try {
        client = new Client(dbOptions);
        await client.connect();
    } catch (e) {
        console.log('e', e);
    }
}

/**
 * Collect Products From Event
 * @param productRecords
 */
function collectProductsFromEvent(productRecords): (string | number)[][] {
    if (!productRecords?.length) {
        return null;
    }

    const products: (string | number)[][] = [];

    console.log('productRecords', productRecords);
    productRecords.forEach(item => {
        if (item?.body) {
            const productData = JSON.parse(item?.body);
            console.log('productData',{... productData}, productData.title);
            products.push(Object.values<string>(productData));
        }
    });

    return products;
}
