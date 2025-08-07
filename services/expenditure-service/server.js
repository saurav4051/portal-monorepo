const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const Project = require('./Project');
const Expense = require('./Expense');

// Import the auth middleware
const auth = require('../auth-service/authMiddleware');

dotenv.config();

const app = express();
const port = 5002;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Expenditure Service: MongoDB connected'))
    .catch(err => console.error('Expenditure Service: MongoDB connection error', err));

// Route to get all projects (Accessible by all roles)
app.get('/projects', async (req, res) => {
    try {
        const projects = await Project.find();
        res.status(200).send(projects);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch projects', details: error.message });
    }
});

// Route to get all expenses (Accessible by all roles)
app.get('/expenses', async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.status(200).send(expenses);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch expenses', details: error.message });
    }
});

// Route to create a new project (Requires 'project-in-charge' or 'super-admin' role)
app.post('/projects', auth(['project-in-charge', 'super-admin']), async (req, res) => {
    try {
        const project = new Project(req.body);
        await project.save();
        res.status(201).send(project);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Route to submit a new expense (Requires 'staff' or 'project-in-charge' role)
app.post('/expenses', auth(['staff', 'project-in-charge', 'super-admin']), async (req, res) => {
    try {
        const expense = new Expense(req.body);
        await expense.save();
        res.status(201).send(expense);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Route to approve an expense (Requires 'super-admin' or 'office-admin' role)
app.put('/expenses/:id/approve', auth(['super-admin', 'office-admin']), async (req, res) => {
    try {
        const expense = await Expense.findByIdAndUpdate(
            req.params.id,
            { status: 'approved' },
            { new: true }
        );
        if (!expense) {
            return res.status(404).send({ error: 'Expense not found' });
        }
        res.status(200).send(expense);
    } catch (error) {
        res.status(400).send({ error: 'Failed to approve expense', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Expenditure Service running on port ${port}`);
});