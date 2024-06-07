import React, { useState } from 'react';
import '../Styles/pages.css';
import signUpImg from "/Images/reg.jpg";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  async function registerUser(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      const response = await fetch(`http://localhost:5001/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        })
      });
      const data = await response.json();
  
      if (response.ok) {
        if (data.token) {
          localStorage.setItem('token', data.token);
          alert("Registration Successful");
  
          // Check if userData is present in the response
          if (data.userData) {
            const userData = data.userData;
            window.location.href = `/profile?firstName=${userData.firstName}&lastName=${userData.lastName}&email=${userData.email}`;
          } else {
            window.location.href = '/profile'; // Redirect to profile page without user data
          }
        } else {
          throw new Error('Token missing in response data');
        }
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register">
      <div className="register-form-container">
        <div className="image">
          <img src={signUpImg} alt="Background" />
        </div>
        <div className="form-container">
          <h2>Register</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={registerUser}>
            <div className="form-group">
              <label htmlFor="firstName">First Name:</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name:</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
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
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
            <a href="/">Already have an account</a>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
