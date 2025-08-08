import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CreateCompanyForm from '../components/CreateCompanyForm';
import CreateDepartmentForm from '../components/CreateDepartmentForm';
import PendingExpensesList from '../components/PendingExpensesList';
import EditCompanyForm from '../components/EditCompanyForm';
import '../App.css';
import '../CompanyAdminTheme.css';

function DashboardPage() {
    const [companies, setCompanies] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingCompany, setEditingCompany] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCompaniesAndDepartments = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/');
                return;
            }

            try {
                const companiesResponse = await axios.get('http://localhost:5000/api/registry/companies', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setCompanies(companiesResponse.data);

                const departmentsResponse = await axios.get('http://localhost:5000/api/registry/departments', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setDepartments(departmentsResponse.data);

            } catch (err) {
                console.error('Failed to fetch data:', err);
                setError('Failed to fetch data.');
            } finally {
                setLoading(false);
            }
        };
        fetchCompaniesAndDepartments();
    }, [navigate]);

    const handleCompanyCreated = (newCompany) => {
        setCompanies(prevCompanies => [...prevCompanies, newCompany]);
    };

    const handleCompanyUpdated = (updatedCompany) => {
        setCompanies(prev => prev.map(company =>
            company._id === updatedCompany._id ? updatedCompany : company
        ));
        setEditingCompany(null);
    };

    const handleDepartmentCreated = (newDepartment) => {
        setDepartments(prevDepartments => [...prevDepartments, newDepartment]);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    if (loading) return <p>Loading data...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="container">
            <div className="header">
                <h1>Company Admin Dashboard</h1>
                <button onClick={handleLogout}>Log Out</button>
            </div>

            <div className="card-grid">
                <div className="card">
                    <CreateCompanyForm onCompanyCreated={handleCompanyCreated} />
                </div>
                <div className="card">
                    <CreateDepartmentForm companies={companies} onDepartmentCreated={handleDepartmentCreated} />
                </div>
            </div>

            <PendingExpensesList />

            <div className="card">
                <h2>Existing Companies</h2>
                {editingCompany ? (
                    <EditCompanyForm
                        company={editingCompany}
                        onCompanyUpdated={handleCompanyUpdated}
                        onCancel={() => setEditingCompany(null)}
                    />
                ) : (
                    <div>
                        {companies.length > 0 ? (
                            companies.map(company => (
                                <div key={company._id} className="list-item">
                                    <div>
                                        <h3>{company.name}</h3>
                                        <p><strong>Contact:</strong> {company.contactEmail}</p>
                                        {/* Display departments for this company */}
                                        {departments.filter(dept => dept.company === company._id).length > 0 && (
                                            <div style={{ marginTop: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                                                <p style={{ fontWeight: 'bold', color: 'var(--text-light)' }}>Departments:</p>
                                                <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                                                    {departments.filter(dept => dept.company === company._id).map(dept => (
                                                        <li key={dept._id} style={{ color: 'var(--text-muted)' }}>- {dept.name}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                    <button onClick={() => setEditingCompany(company)} className="btn-secondary">Edit</button>
                                </div>
                            ))
                        ) : (
                            <p>No companies found. Try creating one!</p>
                        )}
                    </div>
                )}
            </div>

            <div className="card">
                <h2>Existing Departments (All)</h2> {/* Changed title for clarity */}
                <div>
                    {departments.length > 0 ? (
                        departments.map(department => (
                            <div key={department._id} className="list-item">
                                <div>
                                    <h3>{department.name}</h3>
                                    {/* Display company name instead of ID */}
                                    <p><strong>Company:</strong> {companies.find(c => c._id === department.company)?.name || 'N/A'}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No departments found. Try creating one!</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;