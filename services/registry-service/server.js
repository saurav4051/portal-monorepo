const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const Company = require('./Company');
const Department = require('./Department');

// Import the auth middleware
const auth = require('../auth-service/authMiddleware');

dotenv.config();

const app = express();
const port = 5003;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Registry Service: MongoDB connected'))
    .catch(err => console.error('Registry Service: MongoDB connection error', err));

// Route to get all companies (Accessible by all roles)
app.get('/companies', async (req, res) => {
    try {
        const companies = await Company.find();
        res.status(200).send(companies);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch companies', details: error.message });
    }
});

// Route to create a new company (Requires 'platform-admin' role)
app.post('/companies', auth(['platform-admin', 'super-admin']), async (req, res) => {
    try {
        const company = new Company(req.body);
        await company.save();
        res.status(201).send(company);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Route to get a single company by ID
app.get('/companies/:id', async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) {
            return res.status(404).send({ error: 'Company not found' });
        }
        res.status(200).send(company);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch company', details: error.message });
    }
});

// Route to update a company (Requires 'platform-admin' role)
app.put('/companies/:id', auth(['platform-admin']), async (req, res) => {
    try {
        const { name, contactEmail } = req.body;
        const company = await Company.findByIdAndUpdate(
            req.params.id,
            { name, contactEmail },
            { new: true }
        );
        if (!company) {
            return res.status(404).send({ error: 'Company not found' });
        }
        res.status(200).send(company);
    } catch (error) {
        res.status(400).send({ error: 'Failed to update company', details: error.message });
    }
});

// Route to update a company's status (Requires 'super-admin' or 'platform-admin' role)
app.put('/companies/:id/status', auth(['super-admin', 'platform-admin']), async (req, res) => {
    try {
        const { status } = req.body;
        const company = await Company.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!company) {
            return res.status(404).send({ error: 'Company not found' });
        }
        res.status(200).send(company);
    } catch (error) {
        res.status(400).send({ error: 'Failed to update company status', details: error.message });
    }
});

// Route to get all departments (Accessible by all roles)
app.get('/departments', async (req, res) => {
    try {
        const departments = await Department.find();
        res.status(200).send(departments);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch departments', details: error.message });
    }
});

// Route to create a new department (Requires 'super-admin' or 'office-admin' role)
app.post('/departments', auth(['super-admin', 'office-admin']), async (req, res) => {
    try {
        const department = new Department(req.body);
        await department.save();
        res.status(201).send(department);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.listen(port, () => {
    console.log(`Registry Service running on port ${port}`);
});