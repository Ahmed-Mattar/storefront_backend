import Client from "../database";

export interface BaseProduct {
  name: string;
  price: number;
  category_id: number;
};

export interface Product extends BaseProduct {
  id: number;
}

export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      const connection = await Client.connect();
      const sql = "SELECT * FROM products";

      const result = await connection.query(sql);

      connection.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get products. Error: ${err}`);
    }
  }

  async show(id: string): Promise<Product> {
    try {
      const sql = "SELECT * FROM products WHERE id=($1)";

      const connection = await Client.connect();

      const result = await connection.query(sql, [id]);

      connection.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find product ${id}. Error: ${err}`);
    }
  }

  async create(product: BaseProduct): Promise<Product> {
    try {
      const sql =
        "INSERT INTO products (name, price, category_id) VALUES($1, $2, $3) RETURNING *";

      const connection = await Client.connect();

      const result = await connection.query(sql, [product.name, product.price, product.category_id]);

      const createdProduct = result.rows[0];

      connection.release();

      return createdProduct;
    } catch (err) {
      throw new Error(
        `Could not add new product ${product.name}. Error: ${err}`
      );
    }
  }

  async update(product: Product): Promise<Product> {
    try {
      const sql =
        "UPDATE products SET name=($1), price=($2), category_id=($3) WHERE id=($4) RETURNING *";

      const connection = await Client.connect();

      const result = await connection.query(sql, [product.name, product.price, product.category_id, product.id]);

      const updatedProduct = result.rows[0];

      connection.release();

      return updatedProduct;
    } catch (err) {
      throw new Error(
        `Could not update product ${product.name}. Error: ${err}`
      );
    }
  }

  async delete(id: string): Promise<Product> {
    try {
      const sql = "DELETE FROM products WHERE id=($1)";

      const connection = await Client.connect();

      const result = await connection.query(sql, [id]);

      const deletedProduct = result.rows[0];

      connection.release();

      return deletedProduct;
    } catch (err) {
      throw new Error(`Could not delete product ${id}. Error: ${err}`);
    }
  }
}
