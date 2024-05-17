// src/routes.js
const express = require('express');
const router = express.Router();
const db = require('./database');

// Get all books
router.get('/books', (req, res) => {
    db.all("SELECT * FROM books", [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

// Get a single book by id
router.get('/books/:id', (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM books WHERE id = ?", [id], (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": row
        });
    });
});

// Create a new book
router.post('/books', (req, res) => {
    const { name, img, summary } = req.body;
    db.run("INSERT INTO books (name, img, summary) VALUES (?, ?, ?)",
        [name, img, summary],
        function (err) {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({
                "message": "success",
                "data": { id: this.lastID, name, img, summary }
            });
        }
    );
});

// Update a book
router.put('/books/:id', (req, res) => {
    const { id } = req.params;
    const { name, img, summary } = req.body;
    db.run("UPDATE books SET name = ?, img = ?, summary = ? WHERE id = ?",
        [name, img, summary, id],
        function (err) {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({
                "message": "success",
                "changes": this.changes
            });
        }
    );
});

// Delete a book
router.delete('/books/:id', (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM books WHERE id = ?", id, function (err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "deleted",
            "changes": this.changes
        });
    });
});

module.exports = router;
