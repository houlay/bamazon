DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INTEGER(10) NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(20) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER(200) NOT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Nerf Gun", "Toys & Games", 12.99, 50), ("Nintendo Switch", "Toys & Games", 299.99, 10), ("Roblox", "Toys & Games", 14.99, 30);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Headset", "Musical Instruments", 11.78, 20), ("Microphone", "Musical Instruments", 7.58, 30), ("Acoustic Guitar", "Musical Instruments", 32.47, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Paper Towel", "Grocery", 30.44, 25), ("Coconut Oil", "Grocery", 10.58, 50), ("Bottle of Water", "Grocery", 0.99, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Starwars", "Books", 12.50, 10);