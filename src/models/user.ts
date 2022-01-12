import Client from "../database";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

export type User = {
  id: number;
  first_name: string;
  last_name: string;
  password: string;
};

dotenv.config();

const pepper: string = String(process.env.BCRYPT_PASSWORD);
const saltRounds: number = Number(process.env.SALT_ROUNDS);

export class UserStore {
  async create(user: User): Promise<User> {
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
      "SELECT password_digest FROM users WHERE first_name=($1) AND last_name=($2)";

    const result = await connection.query(sql, [first_name, last_name]);

    console.log(password + pepper);

    if (result.rows.length) {
      const user = result.rows[0];

      console.log(user);

      if (bcrypt.compareSync(password + pepper, user.password_digest)) {
        return user;
      }
    }

    return null;
  }
}
