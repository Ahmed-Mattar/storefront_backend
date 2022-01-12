import express from 'express'
import { Product, ProductStore } from '../models/product'

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
        let id: string = req.params.id

        if (id) {
            const product = await store.show(id)
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

const productsRoutes = (app: express.Application) => {
    app.get('/products', index)
    app.get('/products/:id', show)
}

export default productsRoutes