const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Book = require("./models/Book");
const User = require("./models/User");
const auth = require("./middleware/auth");

const app = express();

app.use(cors());
app.use(express.json());


// =========================
// TEST ROUTE
// =========================

app.get("/", (req, res) => {
    res.send("Book Library API is running");
});


// =========================
// REGISTER
// =========================

app.post("/api/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "Registration successful",
            userId: user._id
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// =========================
// LOGIN
// =========================

app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                userId: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.json({
            message: "Login successful",
            token
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// =========================
// GET USER'S BOOKS
// =========================

app.get("/api/books", auth, async (req, res) => {
    try {
        const books = await Book.find({
            userId: req.userId
        });

        res.json(books);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// =========================
// ADD BOOK
// =========================

app.post("/api/books", auth, async (req, res) => {
    try {
        const { title, author } = req.body;

        const book = await Book.create({
            title,
            author,
            userId: req.userId
        });

        res.status(201).json(book);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// =========================
// START SERVER
// =========================

const PORT = process.env.PORT || 5000;

async function startServer() {

    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected successfully!");

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {

        console.log("MongoDB connection failed:");
        console.log(error.message);

    }
}

startServer();