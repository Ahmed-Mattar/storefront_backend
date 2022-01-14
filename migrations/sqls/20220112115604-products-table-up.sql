/* Replace with your SQL commands */
CREATE TABLE products
(
    id SERIAL PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    price integer NOT NULL,
    category_id integer REFERENCES categories (id) NOT NULL
);

ALTER TABLE products
ADD CONSTRAINT FK_CONSTRAINT
    FOREIGN KEY (category_id)
    REFERENCES categories(id)
    ON DELETE CASCADE ON UPDATE NO ACTION;