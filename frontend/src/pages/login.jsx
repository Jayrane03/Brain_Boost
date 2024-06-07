import React, { useState, useEffect } from 'react';
import loginImg from '/Images/login_edu.jpg';
import '../Styles/pages.css';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  CloseButton
} from '@chakra-ui/react';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
  
    try {
      const response = await fetch('http://localhost:5001/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        if (data.token) {
          localStorage.setItem('token', data.token);
  
          // Fetch user data to get the first name
          const userDataResponse = await fetch('http://localhost:5001/api/home', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${data.token}`
            }
          });
  
          if (userDataResponse.ok) {
            const userData = await userDataResponse.json();
            const firstName = userData.user.firstName; // Assuming the first name field is named 'firstName'
            setUserName(firstName); // Set the user's first name
            setSuccess(`Welcome, ${firstName}! Redirecting...`);
            setTimeout(() => {
              window.location.href = '/home';
            }, 2000);
          } else {
            setError('Failed to fetch user data');
          }
        } else {
          setError('Please check your email or password');
        }
      } else {
        setError(data.message || 'Please check your email or password');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="login">
      <div className="login-form-container">
        <div className="image">
          <img src={loginImg} alt="Background" />
        </div>
        <div className="form-container">
          <h2>Login</h2>
          {error && (
            <Alert status="error" mb={4}>
              <AlertIcon />
              <Box flex="1">
                <AlertTitle>Error!</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Box>
              <CloseButton position="absolute" right="8px" top="8px" onClick={() => setError('')} />
            </Alert>
          )}
          {success && (
            <Alert status="success" mb={4}>
              <AlertIcon />
              <Box flex="1">
                <AlertTitle>Welcome, {userName}!</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Box>
              <CloseButton position="absolute" right="8px" top="8px" onClick={() => setSuccess('')} />
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <a href="/register">Create a New Account</a>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
