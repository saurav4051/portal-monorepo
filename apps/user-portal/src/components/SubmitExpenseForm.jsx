import React, { useState } from 'react';
import axios from 'axios';

const SubmitExpenseForm = ({ projects, onExpenseSubmitted }) => {
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        category: '',
        project: ''
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');
        const token = localStorage.getItem('token');
        if (!formData.project) {
            setErrorMessage('Please select a project.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:5000/api/exp-service/expenses', {
                ...formData,
                amount: parseFloat(formData.amount),
                submittedBy: '60c72b2f9b1d8c001f8e4b6a' // Using a placeholder ID
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSuccessMessage('Expense submitted successfully!');
            setFormData({ description: '', amount: '', category: '', project: '' }); // Clear form
            onExpenseSubmitted(response.data);
        } catch (error) {
            setErrorMessage('Failed to submit expense.');
            console.error('Error submitting expense:', error);
        }
    };

    return (
        <div>
            <h3>Submit New Expense</h3>
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                />
                <select
                    name="project"
                    value={formData.project}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select a Project</option>
                    {projects.map(project => (
                        <option key={project._id} value={project._id}>
                            {project.name}
                        </option>
                    ))}
                </select>
                <button type="submit">Submit Expense</button>
            </form>
        </div>
    );
};

export default SubmitExpenseForm;