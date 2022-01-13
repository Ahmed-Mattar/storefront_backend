import Client from "../database";

export interface BaseCategory {
    category: string;

};

export interface Category extends BaseCategory {
    id: number;
}

export class CategoryStore {
    async index(): Promise<Category[]> {
        try {
            const connection = await Client.connect();
            const sql = "SELECT * FROM categories";

            const result = await connection.query(sql);

            connection.release();

            return result.rows;
        } catch (err) {
            throw new Error(`Could not get categories. Error: ${err}`);
        }
    }

    async show(id: string): Promise<Category> {
        try {
            const sql = "SELECT * FROM categories WHERE id=($1)";

            const connection = await Client.connect();

            const result = await connection.query(sql, [id]);

            connection.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not find category ${id}. Error: ${err}`);
        }
    }

    async create(category: BaseCategory): Promise<Category> {
        try {
            const sql =
                "INSERT INTO categories (category) VALUES($1) RETURNING *";

            const connection = await Client.connect();

            const result = await connection.query(sql, [category.category]);

            const createdCategory = result.rows[0];

            connection.release();

            return createdCategory;
        } catch (err) {
            throw new Error(
                `Could not add new category ${category.category}. Error: ${err}`
            );
        }
    }

    async update(category: Category): Promise<Category> {
        try {
            const sql =
                "UPDATE categories SET category =($1) WHERE id=($2) RETURNING *";

            const connection = await Client.connect();

            const result = await connection.query(sql, [category.category, category.id]);

            const updatedCategory = result.rows[0];

            connection.release();

            return updatedCategory;
        } catch (err) {
            throw new Error(
                `Could not update category ${category.category}. Error: ${err}`
            );
        }
    }

    async delete(id: string): Promise<{ id: number }> {
        try {
            const sql = "DELETE FROM categories WHERE id=($1) RETURNING id";

            const connection = await Client.connect();

            const result = await connection.query(sql, [id]);

            const deletedCategory_id = result.rows[0];

            connection.release();

            return deletedCategory_id;
        } catch (err) {
            throw new Error(`Could not delete category ${id}. Error: ${err}`);
        }
    }
}