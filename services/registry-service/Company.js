const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    contactEmail: { type: String, required: true },
    dateCreated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Company', CompanySchema);
