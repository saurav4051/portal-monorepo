import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../App.css'; // Make sure this import is present

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password,
            });

            const token = response.data.token;
            localStorage.setItem('token', token);

            const decodedUser = jwtDecode(token);
            localStorage.setItem('user', JSON.stringify(decodedUser));

            setTimeout(() => {
                navigate('/dashboard');
            }, 100);
        } catch (error) {
            console.error('Login failed:', error.response ? error.response.data : error.message);
            alert('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="form-container">
            <h2>User Portal Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Log In</button>
            </form>
        </div>
    );
}

export default LoginPage;