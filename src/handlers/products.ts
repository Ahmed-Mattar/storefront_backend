import express from 'express'
import { BaseProduct, ProductStore } from '../models/product'
import { verifyAuthJWT } from './users'


const store = new ProductStore()


const index = async (_req: express.Request, res: express.Response) => {
    try {
        const products = await store.index()
        res.status(200).json(products)
        return;
    } catch (error) {
        let message;
        if (error instanceof Error) message = error.message;
        res.status(500).send(message);
        return;
    }
}

const show = async (req: express.Request, res: express.Response) => {
    try {
        let id: number = Number(req.params.id)

        if (id) {
            const product = await store.show(String(id))
            res.status(200).json(product)
            return;
        } else {
            let message = 'please provide a correct product id'
            res.status(404).send(message)
        }

    } catch (error) {
        let message;
        if (error instanceof Error) message = error.message;
        res.status(500).send(message);
        return
    }

}

const create = async (req: express.Request, res: express.Response) => {
    const name: string = req.body.name
    const price: number = Number(req.body.price)
    const category_id: number = Number(req.body.category_id)
    try {
        if (name && price && category_id) {

            const product: BaseProduct = {
                name,
                price,
                category_id
            }

            const newProduct = await store.create(product)
            res.status(201).json(newProduct)
            return
        } else {

            res.status(400).send('please provide a correct name, price and category_id')
            return
        }

    } catch (err) {
        res.status(400)
        res.json(err)
    }

}

const productByCategory = async (req: express.Request, res: express.Response) => {
    try {
        let id: number = Number(req.params.id)

        if (id) {
            const products = await store.productsByCategory(String(id))
            res.status(200).json(products)
            return;
        } else {
            let message = 'please provide a correct category id'
            res.status(404).send(message)
        }

    } catch (error) {
        let message;
        if (error instanceof Error) message = error.message;
        res.status(500).send(message);
        return
    }

}

const productsRoutes = (app: express.Application) => {
    app.get('/products', index)
    app.get('/products/:id', show)
    app.get('/products/category/:id', productByCategory)
    app.post('/products', verifyAuthJWT, create)
}

export default productsRoutes