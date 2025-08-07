import React, { useState } from 'react';
import axios from 'axios';

const CreateCompanyForm = ({ onCompanyCreated }) => {
    const [formData, setFormData] = useState({
        name: '',
        contactEmail: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post('http://localhost:5000/api/registry/companies', formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMessage('Company created successfully!');
            setFormData({ name: '', contactEmail: '' });
            onCompanyCreated(response.data);
        } catch (error) {
            setMessage('Failed to create company.');
            console.error('Error creating company:', error);
        }
    };

    return (
        <div>
            <h3>Create New Company</h3>
            {message && <p className={message.includes('successfully') ? 'success-message' : 'error-message'}>{message}</p>}
            <form onSubmit={handleSubmit} >
                <input
                    type="text"
                    name="name"
                    placeholder="Company Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="contactEmail"
                    placeholder="Contact Email"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Create Company</button>
            </form>
        </div>
    );
};

export default CreateCompanyForm;