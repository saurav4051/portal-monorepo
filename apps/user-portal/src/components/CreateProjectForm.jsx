import React, { useState } from 'react';
import axios from 'axios';

const CreateProjectForm = ({ onProjectCreated }) => {
    const [formData, setFormData] = useState({
        name: '',
        budget: '',
        department: ''
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
        try {
            const response = await axios.post('http://localhost:5000/api/exp-service/projects', formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSuccessMessage('Project created successfully!');
            setFormData({ name: '', budget: '', department: '' }); // Clear form
            onProjectCreated(response.data); // Notify parent component
        } catch (error) {
            setErrorMessage('Failed to create project.');
            console.error('Error creating project:', error);
        }
    };

    return (
        <div>
            <h3>Create New Project</h3>
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Project Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="budget"
                    placeholder="Project Budget"
                    value={formData.budget}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="department"
                    placeholder="Department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Create Project</button>
            </form>
        </div>
    );
};

export default CreateProjectForm;