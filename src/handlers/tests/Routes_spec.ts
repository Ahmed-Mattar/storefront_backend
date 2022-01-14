import supertest from 'supertest';
import app from '../../server';

const request = supertest(app);

let token = ''


describe('Test endpoint responses for the usersRoutes', () => {
    it('create POST /users should return 201 Created', async (done) => {

        const response = await request.post('/users').send({
            first_name: "ahmed",
            last_name: "mattar",
            password: "qwerty"
        });
        token = response.body
        expect(response.status).toBe(201);
        done();
    }
    )

    it('login POST /users/login should return 200 OK', async (done) => {

        const response = await request.post('/users/login').send({
            first_name: "ahmed",
            last_name: "mattar",
            password: "qwerty"
        });

        expect(response.status).toBe(200);
        done();
    }
    )

    it('index GET /users should return 200 OK', async (done) => {

        const response = await request.get('/users').auth(token, { type: 'bearer' })

        expect(response.status).toBe(200);
        done();
    }
    )

    it('show POST /users/:id should return 200 OK', async (done) => {

        const response = await request.get('/users/1').auth(token, { type: 'bearer' })

        expect(response.status).toBe(200 || 404);
        done();
    }
    )

    it('index GET /products should return 200 OK', async (done) => {
        const response = await request.get('/products');
        expect(response.status).toBe(200);
        done();
    }
    )

    it('show GET /products/:id should return 200 OK or 404 Not Found', async (done) => {
        const response = await request.get('/products/1');
        expect(response.status).toBe(200 || 404);
        done();
    }
    )

    it('productByCategory GET /products/category/:id should return 200 OK or 404 Not Found', async (done) => {
        const response = await request.get('/products/category/1');
        expect(response.status).toBe(200 || 404);
        done();
    }
    )

    it('create POST /products should return 201 Created', async (done) => {
        const response = await request.post('/products').send({
            name: "newproduct",
            price: 5000,
            category_id: 5
        }).auth(token, { type: 'bearer' });
        expect(response.status).toBe(201 || 400);
        done();
    }
    )

    it('destroy DELETE /users:id should return 202 Accepted', async (done) => {

        const response = await request.delete('/users/1').auth(token, { type: 'bearer' });
        expect(response.status).toBe(202);

        done();
    }
    )


});


