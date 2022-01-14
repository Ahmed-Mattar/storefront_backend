import express from 'express'
import { BaseUser, UserStore } from '../models/user'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { BaseOrder, OrderStore } from '../models/order'

const store = new UserStore()

const orderStore = new OrderStore

dotenv.config();
const TOKEN_SECRET = process.env.TOKEN_SECRET


const create = async (req: express.Request, res: express.Response) => {

    const first_name: string = req.body.first_name
    const last_name: string = req.body.last_name
    const password: string = req.body.password
    try {
        if (first_name && last_name && password && TOKEN_SECRET) {

            const user: BaseUser = {
                first_name,
                last_name,
                password
            }

            const newUser = await store.create(user)
            var token = jwt.sign({ user: newUser }, TOKEN_SECRET);
            res.status(201).json(token)
            return
        } else {
            res.status(400).send('please provide a correct first name,last name and password')
            return
        }

    } catch (err) {
        res.status(400)
        res.json(err)
    }
}

const login = async (req: express.Request, res: express.Response) => {

    const first_name: string = req.body.first_name
    const last_name: string = req.body.last_name
    const password: string = req.body.password


    try {

        if (first_name && last_name && password && TOKEN_SECRET) {
            const user: BaseUser = {
                first_name,
                last_name,
                password
            }
            const u = await store.authenticate(user.first_name, user.last_name, user.password)
            if (u !== null) {
                var token = jwt.sign({ user: u }, TOKEN_SECRET);
                res.status(200).json(token)
                return
            } else {
                throw new Error('not authorized')
            }

        } else {
            res.status(400).send('please provide a correct first name,last name and password')
            return
        }

    } catch (error) {
        let message;
        if (error instanceof Error) message = error.message;
        res.status(401).send(message);
        return
    }
}

const show = async (req: express.Request, res: express.Response) => {
    try {
        let id: number = Number(req.params.id)

        if (id) {
            const user = await store.show(String(id))
            res.status(200).json(user)
            return;
        } else {
            let message = 'please provide a correct user id'
            res.status(404).send(message)
        }

    } catch (error) {
        let message;
        if (error instanceof Error) message = error.message;
        res.status(500).send(message);
        return
    }

}

const index = async (_req: express.Request, res: express.Response) => {
    try {
        const users = await store.index()
        res.status(200).json(users)
        return;
    } catch (error) {
        let message;
        if (error instanceof Error) message = error.message;
        res.status(500).send(message);
        return;
    }
}


const creat_order = async (req: express.Request, res: express.Response) => {

    const user_id: number = Number(req.params.id)
    try {
        if (user_id) {

            const order: BaseOrder = {
                status: 'active',
                user_id: user_id
            }

            const newOrder = await orderStore.create(order)

            res.status(201).json(newOrder)
            return
        } else {
            res.status(400).send('please provide a correct user id')
            return
        }

    } catch (err) {
        res.status(400)
        res.json(err)
    }

}

const addproduct_toOrder = async (req: express.Request, res: express.Response) => {
    const user_id: number = Number(req.params.user_id)
    const order_id: number = Number(req.params.order_id)


    const quantity: number = Number(req.body.quantity)
    const productId: string = req.body.productId

    const flag = user_id && order_id && quantity && productId

    try {
        if (flag) {

            const order: BaseOrder = {
                status: 'active',
                user_id: user_id
            }

            const newOrder = await orderStore.addProductToOrder(quantity, order_id + '', productId)

            res.status(201).json(newOrder)
            return
        } else {
            res.status(400).send('please provide a correct productsID,quantity in the POST body -- user_id and order_id as parameters')
            return
        }

    } catch (err) {
        res.status(400)
        res.json(err)
    }
}


const currentOrder_byUser = async (req: express.Request, res: express.Response) => {
    const user_id: number = Number(req.params.user_id)

    try {
        if (user_id) {

            const orders = await orderStore.order_by_user(user_id)

            res.status(200).json(orders)
            return
        } else {
            res.status(400).send('please provide a correct user_id as a parameter')
            return
        }

    } catch (err) {
        res.status(400)
        res.json(err)
    }
}


// const destroy = async (req: express.Request, res: express.Response) => {
//     try {
//         let id: number = Number(req.params.id)

//         if (id) {
//             const user = await store.delete(String(id))
//             res.status(202).json(user)
//             return;
//         } else {
//             let message = 'please provide a correct user id'
//             res.status(404).send(message)
//         }

//     } catch (error) {
//         let message;
//         if (error instanceof Error) message = error.message;
//         res.status(500).send(message);
//         return
//     }
// }


export const verifyAuthJWT = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const authorizationHeader = req.headers.authorization
        if (authorizationHeader && TOKEN_SECRET) {
            const token = authorizationHeader.split(' ')[1]
            jwt.verify(token, TOKEN_SECRET)
        } else {
            throw new Error('you are not authorized')
        }
        next()
    } catch (error) {
        res.status(401).send('you are not authorized')
    }
}




const usersRoutes = (app: express.Application) => {
    app.post('/users', create)
    app.post('/users/login', login)
    app.get('/users', verifyAuthJWT, index)
    app.get('/users/:id', verifyAuthJWT, show)
    app.post('/users/:id/order', verifyAuthJWT, creat_order)
    app.get('/users/:user_id/order', verifyAuthJWT, currentOrder_byUser)
    app.post('/users/:user_id/order/:order_id/', verifyAuthJWT, addproduct_toOrder)

    //app.delete('/users/:id', verifyAuthJWT, destroy)

}

export default usersRoutes