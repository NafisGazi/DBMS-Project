// =========================================================================
// RESTAURANT MANAGEMENT SYSTEM - BACKEND API (RENEWED)
// =========================================================================

// 1. IMPORT REQUIRED PACKAGES
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

// 2. INITIALIZE EXPRESS APPLICATION (Fixed ordering to prevent ReferenceError)
const app = express();

// 3. CONFIGURE GLOBAL MIDDLEWARES
app.use(cors());          // Allows your frontend dashboard to fetch data safely
app.use(express.json());  // Enables Express to read JSON data from incoming requests

// 4. SETUP DATABASE CONNECTION POOL
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'restaurant_management_system',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise(); // Promise wrapper allows modern async/await syntax

// Test database availability on startup
pool.getConnection()
    .then(connection => {
        console.log('✅ Connected to the MySQL Restaurant Management Database.');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Database connection failed. Verify details in your .env file:', err.message);
    });

// =========================================================================
// 5. REST API ENDPOINTS
// =========================================================================

// --- MENU ITEMS TABLE ---
app.get('/api/menu-items', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM menu_items');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch menu items', details: err.message });
    }
});

app.post('/api/menu-items', async (req, res) => {
    const { item_id, name, price, category, is_available } = req.body;
    try {
        const query = 'INSERT INTO menu_items (item_id, name, price, category, is_available) VALUES (?, ?, ?, ?, ?)';
        await pool.query(query, [item_id, name, price, category, is_available]);
        res.status(201).json({ message: 'Menu item created successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to insert menu item', details: err.message });
    }
});

app.delete('/api/menu-items/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM menu_items WHERE item_id = ?', [req.params.id]);
        res.json({ message: `Menu item #${req.params.id} deleted successfully` });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete menu item', details: err.message });
    }
});

// --- ORDERS TABLE ---
app.get('/api/orders', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM orders');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch orders', details: err.message });
    }
});

app.post('/api/orders', async (req, res) => {
    const { order_id, table_id, status, total_amount } = req.body;
    try {
        const query = 'INSERT INTO orders (order_id, table_id, status, total_amount, created_at) VALUES (?, ?, ?, ?, NOW())';
        await pool.query(query, [order_id, table_id, status, total_amount]);
        res.status(201).json({ message: 'Order created successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create order', details: err.message });
    }
});

app.put('/api/orders/:id', async (req, res) => {
    const { status, total_amount } = req.body;
    try {
        await pool.query('UPDATE orders SET status = ?, total_amount = ? WHERE order_id = ?', [status, total_amount, req.params.id]);
        res.json({ message: `Order #${req.params.id} updated successfully` });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update order', details: err.message });
    }
});

// --- ORDER ITEMS (JUNCTION TABLE) ---
app.get('/api/order-items', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM order_items');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch order items', details: err.message });
    }
});

app.post('/api/order-items', async (req, res) => {
    const { order_item_id, order_id, item_id, quantity, special_notes } = req.body;
    try {
        const query = 'INSERT INTO order_items (order_item_id, order_id, item_id, quantity, special_notes) VALUES (?, ?, ?, ?, ?)';
        const parsedNotes = special_notes === 'NULL' || !special_notes ? null : special_notes;
        await pool.query(query, [order_item_id, order_id, item_id, quantity, parsedNotes]);
        res.status(201).json({ message: 'Item mapped to order successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add item to order', details: err.message });
    }
});

// --- TABLES SYSTEM ---
app.get('/api/tables', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM tables');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch layout arrangement', details: err.message });
    }
});

app.put('/api/tables/:id/status', async (req, res) => {
    const { status } = req.body;
    try {
        await pool.query('UPDATE tables SET status = ? WHERE table_id = ?', [status, req.params.id]);
        res.json({ message: `Table status adjusted successfully` });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update status', details: err.message });
    }
});

// =========================================================================
// 6. RUN ENGINE
// =========================================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 API active and serving database records at: http://localhost:${PORT}`);
});