import { Product, ProductStore } from "../product";

const store = new ProductStore();

describe("Product Model", () => {
    it("should have an index method", () => {
        expect(store.index).toBeDefined();
    });

    it("should have a show method", () => {
        expect(store.show).toBeDefined();
    });

    it("should have a create method", () => {
        expect(store.create).toBeDefined();
    });

    it("should have a delete method", () => {
        expect(store.delete).toBeDefined();
    });

    it("should have an update method", () => {
        expect(store.update).toBeDefined();
    });

    it('create method should add a product', async () => {
        const result = await store.create({
            name: 'product1',
            price: 50,
            category_id: 1
        });
        expect(result).toEqual({
            id: 1,
            name: 'product1',
            price: 50,
            category_id: 1
        });
    })

    it('index method should return a list of products', async () => {
        const result = await store.index();
        expect(result).toEqual([{
            id: 1,
            name: 'product1',
            price: 50,
            category_id: 1
        }]);
    });

    it('show method should return the correct product', async () => {
        const result = await store.show("1");
        expect(result).toEqual({
            id: 1,
            name: 'product1',
            price: 50,
            category_id: 1
        });
    });

    it('update method should return the updated product', async () => {
        const result = await store.update({
            id: 1,
            name: 'product1',
            price: 5000,
            category_id: 1
        });
        expect(result).toEqual({
            id: 1,
            name: 'product1',
            price: 5000,
            category_id: 1
        });
    });

    it('productsByCategory method should return all products under the provided category', async () => {
        const result = await store.productsByCategory('1')
        expect(result.length).toEqual(1);
    });

    it('delete method should remove the product', async () => {
        await store.delete("1");
        const result = await store.index()

        expect(result).toEqual([]);
    });





});
