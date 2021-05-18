import {Products} from './../products/products'
import {Product} from "../interfaces/products";

export default class DbService {
    countField = 'count';
    productIdField = 'product_id';
    PRODUCTS_TABLE = 'products';
    STOCKS_TABLE = 'stocks';
    private STOCKS_FIELDS = ['product_id', 'count'];

    async createNewItemInTable(client, tableName: string, fields: string[], values: (string | number)[]): Promise<string> {
        const sql = `insert into ${tableName} (${fields.join(',')}) values ('${values.join('\',\'')}') RETURNING id`;
        const {rows: result} = await client.query(sql);
        console.log('createNewItemInTable.result', result);
        return result?.[0].id;
    }

    async createNewItemInStocks(client, newProductId: string, count: number): Promise<void> {
        const sql = `insert into ${this.STOCKS_TABLE} (${this.STOCKS_FIELDS.join(',')}) values ('${newProductId}', ${count})`;
        console.log('createNewItemInStocks.sql', sql);
        await client.query(sql);
    }

    async getProductById(client, productId: string): Promise<Product[]> {
        const sql = `SELECT p.*, s.count FROM ${this.PRODUCTS_TABLE} p, ${this.STOCKS_TABLE} s where s.${this.productIdField} = p.id AND p.id='${productId}'`;
        console.log('getProductById.sql', sql);
        const {rows: result} = await client.query(sql);
        return result?.[0];
    }

    async getAllProductsWithCount(client): Promise<Product[]> {
        const sql = `SELECT p.*, s.count FROM ${this.PRODUCTS_TABLE} p, ${this.STOCKS_TABLE} s where s.${this.productIdField} = p.id`;
        console.log('getAllProductsWithCount.sql', sql);
        const {rows: result} = await client.query(sql);
        return result;
    }

    async insertInitialDataIfNeed(client): Promise<void> {
        const countItems = await this.getTableCount(client, this.PRODUCTS_TABLE);
        console.log('insertInitialDataIfNeed', countItems);
        if (countItems === 0) {
            await this.insertInitialProducts(client);
            await this.insertInitialStocks(client);
        }
    }

    private async getTableCount(client, table: string): Promise<number> {
        const {rows: result} = await client.query(`select count(id)
                                                   from ${table}`);
        console.log('getTableCount', +result?.[0].count);
        return +result?.[0].count;
    }

    private async insertInitialProducts(client) {
        const initSqlByList = this.getInsertProductsSQlFromList(Products);
        console.log('insertInitialProducts', initSqlByList);
        await client.query(initSqlByList);
    }

    private getInsertProductsSQlFromList(products: Product[]): string {
        const fieldList = Object.keys(products?.[0])?.filter(field => field !== this.countField);
        let values = '';

        products.forEach(product => {
            const copyProduct = {...product};
            delete copyProduct.count;
            const productsValues = Object.values(copyProduct);
            values += `${values ? ',' : ''}('${productsValues.join('\',\'')}')`;
        });
        const sql = `insert into ${this.PRODUCTS_TABLE} (${fieldList.join(',')})
                     values ${values}`;

        console.log('getInsertProductsSQlFromList.sql', sql);
        return sql;
    }

    private async insertInitialStocks(client) {
        const initSqlByList = this.getInsertStocksSQlFromList(Products);
        console.log('insertInitialStocks', initSqlByList);
        await client.query(initSqlByList);
    }

    private getInsertStocksSQlFromList(products: Product[]): string {
        let values = '';

        products.forEach(product => {
            const {id, count} = product;
            values += `${values ? ',' : ''}('${id}', ${count})`;
        });

        return `insert into ${this.STOCKS_TABLE} (${this.STOCKS_FIELDS.join(',')})
                values ${values}`;
    }

    async getTableItems(client, table: string) {
        const {rows: items} = await client.query(`select *
                                                  from ${table}`);
        return items;
    }
}
