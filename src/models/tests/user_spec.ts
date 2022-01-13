import { User, UserStore } from "../user";
import bcrypt from "bcrypt";


const store = new UserStore();



describe("User Model", () => {


    it("should have a create method", () => {
        expect(store.create).toBeDefined();
    });

    it("should have an authenticate method", () => {
        expect(store.authenticate).toBeDefined();
    });

    it("should have an index method", () => {
        expect(store.index).toBeDefined();
    });

    it("should have a show method", () => {
        expect(store.show).toBeDefined();
    });


    it('create method should add a user', async () => {
        const result = await store.create({
            first_name: 'ahmed',
            last_name: 'mattar',
            password: 'qwerty'
        });

        expect(result).toEqual(jasmine.objectContaining({
            id: 1,
            first_name: 'ahmed',
            last_name: 'mattar',
        }))
    })

    it('authenticate method should return the user provided the correct password', async () => {
        const result = await store.authenticate('ahmed', 'mattar', 'qwerty')

        expect(result).toBeTruthy()
    })

    it('authenticate method should return null provided the wrong password', async () => {
        const result = await store.authenticate('ahmed', 'mattar', 'qqwweerrtt')

        expect(result).toBeFalsy()
    })

    it('index method should return array of users', async () => {
        const result = await store.index()

        expect(result.length).toBeGreaterThan(0)
    })

    it('show method should return a user', async () => {
        const result = await store.show('1')

        expect(result).toEqual(jasmine.objectContaining({
            id: 1,
            first_name: 'ahmed',
            last_name: 'mattar',
        }))
    })

    it('update method should return an updated user', async () => {
        const result = await store.update({
            id: 1,
            first_name: 'ahmed',
            last_name: 'salah',
            password: 'newupdatedPass'
        })
        expect(result).toEqual(jasmine.objectContaining({
            id: 1,
            last_name: 'salah',
        }))
    })

    it('delete method should remove the user', async () => {
        store.delete("1");
        const result = await store.index()

        expect(result).toEqual([]);
    });

});
