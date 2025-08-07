import React, { useState } from 'react';
import axios from 'axios';

const CreateDepartmentForm = ({ companies, onDepartmentCreated }) => {
    const [formData, setFormData] = useState({
        name: '',
        company: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post('http://localhost:5000/api/registry/departments', formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMessage('Department created successfully!');
            setFormData({ name: '', company: '' });
            onDepartmentCreated(response.data);
        } catch (error) {
            setMessage('Failed to create department.');
            console.error('Error creating department:', error);
        }
    };

    return (
        <div>
            <h3>Create New Department</h3>
            {message && <p className={message.includes('successfully') ? 'success-message' : 'error-message'}>{message}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Department Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <select
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select a Company</option>
                    {companies.map(company => (
                        <option key={company._id} value={company._id}>
                            {company.name}
                        </option>
                    ))}
                </select>
                <button type="submit">Create Department</button>
            </form>
        </div>
    );
};

export default CreateDepartmentForm;