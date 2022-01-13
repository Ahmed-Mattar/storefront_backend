import Client from "../database";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

export interface BaseUser {
  first_name: string;
  last_name: string;
  password: string;
};

export interface User extends BaseUser {
  id: number
}

dotenv.config();

const pepper: string = String(process.env.BCRYPT_PASSWORD);
const saltRounds: number = Number(process.env.SALT_ROUNDS);

export class UserStore {



  async create(user: BaseUser): Promise<User> {
    try {
      const connection = await Client.connect();
      // RETURNING *  just returns all cols
      const sql =
        "INSERT INTO users (first_name,last_name,password) VALUES ($1, $2, $3) RETURNING *";

      const hash = bcrypt.hashSync(user.password + pepper, saltRounds);

      const result = await connection.query(sql, [
        user.first_name,
        user.last_name,
        hash,
      ]);
      const createdUser = result.rows[0];

      connection.release();

      return createdUser;
    } catch (error) {
      throw new Error(
        `unable create user (${user.first_name} ${user.last_name}): ${error}`
      );
    }
  }

  async authenticate(
    first_name: string,
    last_name: string,
    password: string
  ): Promise<User | null> {
    const connection = await Client.connect();
    const sql =
      "SELECT password FROM users WHERE first_name=($1) AND last_name=($2)";

    const result = await connection.query(sql, [first_name, last_name]);

    if (result.rows.length) {
      const user = result.rows[0];
      if (bcrypt.compareSync(password + pepper, user.password)) {
        return user;
      }
    }

    return null;
  }

  async index(): Promise<User[]> {
    try {
      const connection = await Client.connect();
      const sql = "SELECT * FROM users";

      const result = await connection.query(sql);

      connection.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get users. Error: ${err}`);
    }
  }

  async show(id: string): Promise<User> {
    try {
      const sql = "SELECT * FROM users WHERE id=($1)";

      const connection = await Client.connect();

      const result = await connection.query(sql, [id]);

      connection.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find user ${id}. Error: ${err}`);
    }
  }

  async update(user: User): Promise<User> {
    try {
      const sql =
        "UPDATE users SET first_name=($1), last_name=($2), password=($3) WHERE id=($4) RETURNING *";

      const connection = await Client.connect();

      const hash = bcrypt.hashSync(user.password + pepper, saltRounds);

      const result = await connection.query(sql, [user.first_name, user.last_name, hash, user.id]);

      const updatedUser = result.rows[0];

      connection.release();

      return updatedUser;
    } catch (err) {
      throw new Error(
        `Could not update user ${user.first_name} ${user.last_name}. Error: ${err}`
      );
    }
  }

  async delete(id: string): Promise<User> {
    try {
      const sql = "DELETE FROM users WHERE id=($1)";

      const connection = await Client.connect();

      const result = await connection.query(sql, [id]);

      const deletedUser = result.rows[0];

      connection.release();

      return deletedUser;
    } catch (err) {
      throw new Error(`Could not delete user ${id}. Error: ${err}`);
    }
  }


}
