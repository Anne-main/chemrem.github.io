// Backend Server Setup - Node.js/Express
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'constructchem_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// API Routes

// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [products] = await connection.query('SELECT * FROM products');
        
        // Get features for each product
        for (let product of products) {
            const [features] = await connection.query(
                'SELECT * FROM product_features WHERE product_id = ?',
                [product.id]
            );
            product.features = features;
        }
        
        connection.release();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single product by ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [product] = await connection.query(
            'SELECT * FROM products WHERE id = ?',
            [req.params.id]
        );
        
        if (product.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        // Get specifications
        const [specs] = await connection.query(
            'SELECT * FROM product_specifications WHERE product_id = ?',
            [req.params.id]
        );
        
        // Get applications
        const [applications] = await connection.query(
            'SELECT * FROM product_applications WHERE product_id = ?',
            [req.params.id]
        );
        
        connection.release();
        
        const result = {
            ...product[0],
            specifications: specs[0],
            applications: applications
        };
        
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get products by category
app.get('/api/products/category/:category', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [products] = await connection.query(
            'SELECT * FROM products WHERE category = ?',
            [req.params.category]
        );
        
        connection.release();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all procedures
app.get('/api/procedures', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [procedures] = await connection.query('SELECT * FROM procedures');
        connection.release();
        res.json(procedures);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get procedure details
app.get('/api/procedures/:id', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [procedure] = await connection.query(
            'SELECT * FROM procedures WHERE id = ?',
            [req.params.id]
        );
        
        if (procedure.length === 0) {
            return res.status(404).json({ error: 'Procedure not found' });
        }
        
        const [steps] = await connection.query(
            'SELECT * FROM procedure_steps WHERE procedure_id = ? ORDER BY step_number',
            [req.params.id]
        );
        
        const [safety] = await connection.query(
            'SELECT * FROM safety_precautions WHERE procedure_id = ?',
            [req.params.id]
        );
        
        const [checklist] = await connection.query(
            'SELECT * FROM quality_checklist WHERE procedure_id = ?',
            [req.params.id]
        );
        
        connection.release();
        
        const result = {
            ...procedure[0],
            steps: steps,
            safetyPrecautions: safety,
            qualityChecklist: checklist
        };
        
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all services
app.get('/api/services', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [services] = await connection.query('SELECT * FROM services');
        connection.release();
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get service details
app.get('/api/services/:id', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [service] = await connection.query(
            'SELECT * FROM services WHERE id = ?',
            [req.params.id]
        );
        
        if (service.length === 0) {
            return res.status(404).json({ error: 'Service not found' });
        }
        
        const [scope] = await connection.query(
            'SELECT * FROM service_scope WHERE service_id = ?',
            [req.params.id]
        );
        
        const [benefits] = await connection.query(
            'SELECT * FROM service_benefits WHERE service_id = ?',
            [req.params.id]
        );
        
        connection.release();
        
        const result = {
            ...service[0],
            scope: scope,
            benefits: benefits
        };
        
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Submit contact form
app.post('/api/contact', async (req, res) => {
    const { name, email, phone, message } = req.body;
    
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    try {
        const connection = await pool.getConnection();
        await connection.query(
            'INSERT INTO contact_submissions (name, email, phone, message) VALUES (?, ?, ?, ?)',
            [name, email, phone || null, message]
        );
        
        connection.release();
        res.json({ success: true, message: 'Contact form submitted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;