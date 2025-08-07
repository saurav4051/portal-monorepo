const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const User = require('./User');

dotenv.config();

const app = express();
const port = 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Registration route
app.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword, role });
        await user.save();
        res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).send({ error: 'User registration failed', details: error.message });
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).send({ message: 'Logged in successfully', token });
    } catch (error) {
        res.status(500).send({ error: 'Login failed', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Auth Service running on port ${port}`);
});