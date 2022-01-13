import { Category, CategoryStore } from "../category";

const store = new CategoryStore();

describe("category Model", () => {
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

    it('index method should return a list of categories', async () => {
        const result = await store.index();
        expect(result.length).toBeGreaterThan(1);
    });

    it('show method should return the correct category', async () => {
        const result = await store.show("1");
        expect(result).toEqual({
            id: 1,
            category: 'category1'
        });
    });

    it('create method should add a category', async () => {
        const result = await store.create({
            category: 'category7',
        });

        expect(result).toEqual({
            id: 7,
            category: 'category7',

        });
    })

    it('update method should return the updated category', async () => {
        const result = await store.update({
            id: 7,
            category: 'category77',
        });
        expect(result).toEqual({
            id: 7,
            category: 'category77',
        });
    });

    it('delete method should remove the category', async () => {
        const result = await store.delete("7")


        expect(result).toEqual({ id: 7 });
    });

});
