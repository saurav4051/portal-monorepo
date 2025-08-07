import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser(decodedToken);
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        setUser(null);
      }
    }
  }, []);

  return user;
};

export default useAuth;