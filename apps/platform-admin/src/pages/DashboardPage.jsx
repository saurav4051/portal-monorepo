import React from 'react';
import { useNavigate } from 'react-router-dom';
import CompanyManagement from '../components/CompanyManagement';
import '../App.css'; // Make sure this import is present

function DashboardPage() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="container">
            <div className="header">
                <h1>Platform Admin Dashboard</h1>
                <button onClick={handleLogout}>Log Out</button>
            </div>
            <div className="card">
                <CompanyManagement />
            </div>
        </div>
    );
}

export default DashboardPage;