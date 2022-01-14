## API Endpoints

note: replace {localhost} with yours

#### Products

- Index GET: {localhost}/products
- Show GET: {localhost}/products/:id
- Create POST {localhost}/products with a body for example { "name":"product","price":200,"category_id":1 }
- [OPTIONAL] Products by category (args: product category) [token required] GET: {localhost}/products/category/:id

#### Users

- Index [token required] GET: {localhost}/users
- Show [token required] GET: {localhost}/users/:id
- Create POST: {localhost}/users with a body for example { "first_name":"first","last_name":"last","password":"password" }
- Login POST: {localhost}/users/login with a body for example { "first_name":"first","last_name":"last","password":"password" }

#### Orders

- create order [token required] POST: {localhost}/users/:id/order
- add products to order [token required] POST:{localhost}/users/:user_id/order/:order_id with a body for example {"quantity":11,"productId":'1'}
- Current Order by user (args: user id)[token required]

## Data Shapes

#### Product

- id
- name
- price
- [OPTIONAL] category

#### User

- id
- firstName
- lastName
- password

#### Orders

- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)
-

## Tables

### User

    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password VARCHAR NOT NULL

id | first_name | last_name | password |

### categories

    id SERIAL PRIMARY KEY,
    category VARCHAR(64) NOT NULL

id | category |

### products

     id SERIAL PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    price integer NOT NULL,
    category_id integer REFERENCES categories (id) NOT NULL

id | name | price | category_id REFERENCES categories(id) |

### orders

    id SERIAL PRIMARY KEY,
    status VARCHAR(15),
    user_id bigint REFERENCES users(id)
    CONSTRAINT check_status check (status in ('active','complete'))

id | status | user_id REFERENCES users(id)|

### order_products

    id SERIAL PRIMARY KEY,
    quantity integer,
    order_id bigint REFERENCES orders(id),
    product_id bigint REFERENCES products(id)

id | quantity | order_id REFERENCES orders(id) | product_id REFERENCES products(id) |
