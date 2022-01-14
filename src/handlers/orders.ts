import express from 'express'
import { BaseOrder, OrderStore } from '../models/order'
import { verifyAuthJWT } from '../handlers/users'


const orderStore = new OrderStore







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



const ordersRoutes = (app: express.Application) => {
    app.post('/users/:id/order', verifyAuthJWT, creat_order)
    app.get('/users/:user_id/order', verifyAuthJWT, currentOrder_byUser)
    app.post('/users/:user_id/order/:order_id', verifyAuthJWT, addproduct_toOrder)


}

export default ordersRoutes