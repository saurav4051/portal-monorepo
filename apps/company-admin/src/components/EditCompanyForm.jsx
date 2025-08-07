import React, { useState } from 'react';
import axios from 'axios';

const EditCompanyForm = ({ company, onCompanyUpdated, onCancel }) => {
    const [formData, setFormData] = useState({
        name: company.name,
        contactEmail: company.contactEmail
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await axios.put(`http://localhost:5000/api/registry/companies/${company._id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMessage('Company updated successfully!');
            onCompanyUpdated(response.data);
        } catch (error) {
            setMessage('Failed to update company.');
            console.error('Error updating company:', error);
        }
    };

    return (
        <div>
            <h3>Edit Company: {company.name}</h3>
            {message && <p className={message.includes('successfully') ? 'success-message' : 'error-message'}>{message}</p>}
            <form onSubmit={handleSubmit}>
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
                <button type="submit">Update Company</button>
                <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
            </form>
        </div>
    );
};

export default EditCompanyForm;