const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Book = require("./models/Book");

const app = express();

app.use(cors());
app.use(express.json());


// Test route
app.get("/", (req, res) => {
    res.send("Book Library API is running");
});


// Get all books
app.get("/api/books", async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// Add a book
app.post("/api/books", async (req, res) => {
    try {
        const book = new Book({
            title: req.body.title,
            author: req.body.author
        });

        const savedBook = await book.save();

        res.status(201).json(savedBook);

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});


const PORT = process.env.PORT || 5000;


// Connect MongoDB first
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {

        console.log("MongoDB connected successfully!");

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
        });

    })
    .catch((error) => {

        console.log("MongoDB connection failed:");
        console.log(error.message);

    });