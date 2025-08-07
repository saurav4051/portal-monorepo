import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CompanyManagement = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCompany, setSelectedCompany] = useState(null);

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://localhost:5000/api/registry/companies', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCompanies(response.data);
        } catch (err) {
            setError('Failed to fetch companies.');
            console.error('Error fetching companies:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (companyId, newStatus) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.put(`http://localhost:5000/api/registry/companies/${companyId}/status`, { status: newStatus }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCompanies(prev => prev.map(company =>
                company._id === companyId ? { ...company, status: newStatus } : company
            ));
        } catch (error) {
            console.error('Failed to update company status:', error);
            alert('Failed to update company status.');
        }
    };

    if (loading) return <p>Loading companies...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div>
            <h2>Company Management</h2>
            {companies.length > 0 ? (
                companies.map(company => (
                    <div key={company._id} className="list-item">
                        <div>
                            <h3>{company.name}</h3>
                            <p><strong>Status:</strong> {company.status}</p>
                        </div>
                        <div>
                            <button onClick={() => setSelectedCompany(company)} className="btn-secondary" style={{ marginRight: '10px' }}>View Details</button>
                            {company.status === 'active' ? (
                                <button onClick={() => handleStatusUpdate(company._id, 'inactive')}>Deactivate</button>
                            ) : (
                                <button onClick={() => handleStatusUpdate(company._id, 'active')}>Activate</button>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <p>No companies found.</p>
            )}

            {selectedCompany && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Company Details</h3>
                        <p><strong>Name:</strong> {selectedCompany.name}</p>
                        <p><strong>Contact Email:</strong> {selectedCompany.contactEmail}</p>
                        <p><strong>Status:</strong> {selectedCompany.status}</p>
                        <p><strong>ID:</strong> {selectedCompany._id}</p>
                        <button onClick={() => setSelectedCompany(null)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompanyManagement;