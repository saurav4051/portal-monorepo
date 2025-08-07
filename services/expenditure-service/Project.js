const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    budget: { type: Number, required: true },
    department: { type: String, required: true },
    // This links the project to a user in the auth service
    projectInCharge: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['active', 'completed', 'on-hold'], default: 'active' }
});

module.exports = mongoose.model('Project', ProjectSchema);