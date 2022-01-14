import { Order, OrderStore } from "../order";
import { UserStore } from "../user"
import { ProductStore } from '../product'


const orderStore = new OrderStore();
const userStore = new UserStore();
const productStore = new ProductStore();

describe("Order Model", () => {


    it("should have a create method", () => {
        expect(orderStore.create).toBeDefined();
    });

    it("should have an index method", () => {
        expect(orderStore.show).toBeDefined();
    });

    it("should have an addProductToOrder method", () => {
        expect(orderStore.addProductToOrder).toBeDefined();
    });

    it('create method should add an order', async () => {

        const user = await userStore.create({
            first_name: 'userfortest',
            last_name: 'userfortestlastname',
            password: 'userfortestpass'
        })


        const result = await orderStore.create({
            status: 'active',
            user_id: user.id
        })

        expect(result).toEqual(jasmine.objectContaining({
            status: 'active',
            user_id: `${user.id}`
        }))
    })

    it('index method should return all created orders', async () => {

        const result = await orderStore.index()

        expect(result.length).toBeGreaterThanOrEqual(1)
    })

    it('show method should return an order', async () => {

        const result = await orderStore.show('1')

        expect(result).toEqual(jasmine.objectContaining({
            id: 1,
            status: 'active'
        }))
    })


    it('addProductToOrder method should return a product to the order', async () => {
        const product = await productStore.create({
            name: 'productForTest',
            price: 250,
            category_id: 1
        })

        const result = await orderStore.addProductToOrder(1, '1', product.id + '')

        console.log(result)

    })


});