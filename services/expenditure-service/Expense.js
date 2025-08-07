const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: Date, default: Date.now },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    // This links the expense to a user in the auth service
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
});

module.exports = mongoose.model('Expense', ExpenseSchema);