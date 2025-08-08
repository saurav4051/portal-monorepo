import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CreateProjectForm from '../components/CreateProjectForm';
import SubmitExpenseForm from '../components/SubmitExpenseForm';
import '../App.css';
import '../UserPortalTheme.css';

function DashboardPage() {
    const [projects, setProjects] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [departments, setDepartments] = useState([]); // New state for departments
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));

        if (!token || !user) {
            navigate('/');
            return;
        }

        setUserRole(user.role);

        const fetchAllData = async () => {
            try {
                // Fetch Projects
                const projectsResponse = await axios.get('http://localhost:5000/api/exp-service/projects', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setProjects(projectsResponse.data);

                // Fetch Expenses
                const expensesResponse = await axios.get('http://localhost:5000/api/exp-service/expenses', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setExpenses(expensesResponse.data);

                // Fetch Departments (needed to map project department IDs to names)
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
        fetchAllData();
    }, [navigate]);

    const getDepartmentName = (deptId) => {
        const department = departments.find(dept => dept._id === deptId);
        return department ? department.name : 'N/A';
    };

    const getProjectName = (projectId) => {
        const project = projects.find(proj => proj._id === projectId);
        return project ? project.name : 'N/A';
    };

    const handleProjectCreated = (newProject) => {
        setProjects(prevProjects => [...prevProjects, newProject]);
    };

    const handleExpenseSubmitted = (newExpense) => {
        setExpenses(prevExpenses => [...prevExpenses, newExpense]);
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
                <h1>Projects Dashboard</h1>
                <button onClick={handleLogout}>Log Out</button>
            </div>

            <div className="card-grid">
                {userRole && (userRole === 'project-in-charge' || userRole === 'super-admin') && (
                    <div className="card">
                        <CreateProjectForm onProjectCreated={handleProjectCreated} />
                    </div>
                )}
                {userRole && (userRole === 'staff' || userRole === 'project-in-charge' || userRole === 'super-admin') && (
                    <div className="card">
                        <SubmitExpenseForm projects={projects} onExpenseSubmitted={handleExpenseSubmitted} />
                    </div>
                )}
            </div>

            <div className="card">
                <h2>Existing Projects</h2>
                <div>
                    {projects.length > 0 ? (
                        projects.map(project => (
                            <div key={project._id} className="list-item">
                                <div>
                                    <h3>{project.name}</h3>
                                    <p><strong>Department:</strong> {getDepartmentName(project.department)}</p> {/* Display name */}
                                    <p><strong>Budget:</strong> ${project.budget}</p>
                                    <p><strong>Status:</strong> {project.status}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No projects found.</p>
                    )}
                </div>
            </div>

            <div className="card">
                <h2>Recent Expenses</h2>
                <div>
                    {expenses.length > 0 ? (
                        expenses.map(expense => (
                            <div key={expense._id} className="list-item">
                                <div>
                                    <p><strong>Description:</strong> {expense.description}</p>
                                    <p><strong>Amount:</strong> ${expense.amount}</p>
                                    <p><strong>Category:</strong> {expense.category}</p>
                                    <p><strong>Project:</strong> {getProjectName(expense.project)}</p> {/* Display name */}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No expenses submitted yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;