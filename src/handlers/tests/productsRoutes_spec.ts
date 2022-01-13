import supertest from 'supertest';
import app from '../../server';

const request = supertest(app);
describe('Test endpoint responses for the productsRoutes', () => {
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
});