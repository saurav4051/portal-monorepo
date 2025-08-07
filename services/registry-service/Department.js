const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true }
});

module.exports = mongoose.model('Department', DepartmentSchema);