CREATE DATABASE restaurant_management_system;

CREATE TABLE tables (
    table_id INT PRIMARY KEY AUTO_INCREMENT,
    table_number VARCHAR(50),
    capacity INT,
    status VARCHAR(50)
);

CREATE TABLE menu_items (
    item_id INT PRIMARY KEY,
    name VARCHAR(255),
    price DECIMAL(10,2),
    category VARCHAR(100),
    is_available TINYINT(1)
);

CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    table_id INT,
    status VARCHAR(50),
    total_amount DECIMAL(10,2),
    created_at DATETIME,
    FOREIGN KEY (table_id) REFERENCES tables(table_id)
);

CREATE TABLE order_items (
    order_item_id INT PRIMARY KEY,
    order_id INT,
    item_id INT,
    quantity INT,
    special_notes VARCHAR(255),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (item_id) REFERENCES menu_items(item_id)
);



INSERT INTO tables VALUES 
(1, 'Table 1', 2, 'Available'),
(2, 'Table 2', 2, 'Occupied'),
(3, 'Table 3', 4, 'Occupied'),
(4, 'Table 4', 4, 'Dirty'),
(5, 'Booth 11', 6, 'Occupied'),
(6, 'Booth 12', 6, 'Available'),
(7, 'Bar 1', 1, 'Occupied'),
(8, 'Bar 2', 1, 'Available');

INSERT INTO menu_items VALUES 
(101, 'Kacchi Biryani', 450.00, 'Main', 1),
(102, 'Chicken Fry (2pc)', 160.00, 'Appetizer', 1),
(103, 'Beef Sheek Kebab', 220.00, 'Main', 1),
(104, 'Mutton Rezala', 350.00, 'Main', 1),
(105, 'Fuchka', 80.00, 'Appetizer', 1),
(106, 'Chicken Fried Rice', 250.00, 'Main', 1),
(107, 'Borhani', 60.00, 'Beverage', 1),
(108, '7 Color Tea', 90.00, 'Beverage', 1),
(109, 'Falooda', 180.00, 'Dessert', 1),
(110, 'Rasmalai', 220.00, 'Dessert', 0);

INSERT INTO orders VALUES 
(5001, 2, 'Served', 620.00, '2026-06-18 17:15:00'),
(5002, 7, 'Paid', 150.00, '2026-06-18 17:30:00'),
(5003, 3, 'In-Progress', 1330.00, '2026-06-18 17:45:00'),
(5004, 5, 'Pending', 1070.00, '2026-06-18 18:02:00'),
(5005, 4, 'Paid', 450.00, '2026-06-18 16:30:00'),
(5006, 2, 'Pending', 90.00, '2026-06-18 18:10:00');

INSERT INTO order_items VALUES 
(901, 5001, 103, 2, 'Make it extra spicy'),
(902, 5001, 107, 3, NULL),
(903, 5002, 108, 1, NULL),
(904, 5002, 107, 1, 'Serve chilled'),
(905, 5003, 101, 1, 'Extra aloo please'),
(906, 5003, 104, 2, 'Lean meat only'),
(907, 5003, 109, 1, 'Bring out after mains'),
(908, 5004, 106, 3, 'Add extra egg to one'),
(909, 5004, 102, 2, 'Extra crispy'),
(910, 5006, 108, 1, NULL);