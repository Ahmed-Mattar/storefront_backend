import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import productsRoutes from './handlers/products'
import usersRoutes from './handlers/users'

const app: express.Application = express();
const address: string = "0.0.0.0:3000";

app.use(cors())
app.use(bodyParser.json());

app.get("/", async function (req: Request, res: Response) {
  res.send("homepage");
});


productsRoutes(app)
usersRoutes(app)

app.listen(3000, function () {
  console.log(`starting app on: ${address}`);
});


export default app