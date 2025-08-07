import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PendingExpensesList = () => {
    const [pendingExpenses, setPendingExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPendingExpenses();
    }, []);

    const fetchPendingExpenses = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://localhost:5000/api/exp-service/expenses', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setPendingExpenses(response.data.filter(exp => exp.status === 'pending'));
        } catch (err) {
            setError('Failed to fetch pending expenses.');
            console.error('Error fetching expenses:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (expenseId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`http://localhost:5000/api/exp-service/expenses/${expenseId}/approve`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setPendingExpenses(prev => prev.filter(exp => exp._id !== expenseId));
        } catch (error) {
            console.error('Failed to approve expense:', error);
            alert('Failed to approve expense.');
        }
    };

    if (loading) return <p>Loading pending expenses...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div>
            <h2>Pending Expenses</h2>
            {pendingExpenses.length > 0 ? (
                pendingExpenses.map(expense => (
                    <div key={expense._id} className="list-item">
                        <div>
                            <h3>{expense.description}</h3>
                            <p><strong>Amount:</strong> ${expense.amount}</p>
                        </div>
                        <button onClick={() => handleApprove(expense._id)}>Approve</button>
                    </div>
                ))
            ) : (
                <p>No pending expenses to review.</p>
            )}
        </div>
    );
};

export default PendingExpensesList;