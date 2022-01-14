import Client from "../database";

export interface BaseOrder {
    status: 'active' | 'complete';
    user_id: number

};

export interface Order extends BaseOrder {
    id: number;
}

export class OrderStore {
    async index(): Promise<Order[]> {
        try {
            const connection = await Client.connect();
            const sql = "SELECT * FROM orders";

            const result = await connection.query(sql);

            connection.release();

            return result.rows;
        } catch (err) {
            throw new Error(`Could not get orders. Error: ${err}`);
        }
    }

    async show(id: string): Promise<Order> {
        try {
            const sql = "SELECT * FROM orders WHERE id=($1)";

            const connection = await Client.connect();

            const result = await connection.query(sql, [id]);

            connection.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not find order ${id}. Error: ${err}`);
        }
    }

    async create(order: BaseOrder): Promise<Order> {
        try {
            const sql =
                "INSERT INTO orders (status,user_id) VALUES($1, $2) RETURNING *";

            const connection = await Client.connect();

            const result = await connection.query(sql, [order.status, order.user_id]);

            const createdOrder = result.rows[0];

            connection.release();

            return createdOrder;
        } catch (err) {
            throw new Error(
                `Could not add new order for ${order.user_id}. Error: ${err}`
            );
        }
    }

    async addProductToOrder(quantity: number, orderId: string, productId: string): Promise<Order> {
        try {
            const sql = 'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *'

            const conn = await Client.connect()

            const result = await conn
                .query(sql, [quantity, orderId, productId])

            const order = result.rows[0]

            conn.release()

            return order
        } catch (err) {
            throw new Error(`Could not add product ${productId} to order ${orderId}: ${err}`)
        }
    }

    async order_by_user(user_id: number): Promise<Order[]> {
        try {
            const sql = 'SELECT * FROM users INNER JOIN orders ON users.id = orders.user_id WHERE users.id = ($1)'

            const conn = await Client.connect()

            const result = await conn
                .query(sql, [user_id])

            const final_result = result.rows

            conn.release()

            return final_result
        } catch (err) {
            throw new Error(`Could not retreive any orders from user ${user_id}: ${err}`)
        }
    }



}