// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  // Import useNavigate
// Import the gql tag function and the Apollo Client instance
import { gql, useMutation } from '@apollo/client';

// Define your mutation string based on your server's schema
const REGISTER_USER = gql`
  mutation Register($user: UserInput!) {
    register(user: $user) {
      message
      user {
        id
        user_name
        email
      }
    }
  }
`;

const RegisterPage: React.FC = () => {
  const [register] = useMutation(REGISTER_USER);  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');  // State to hold the success message
  const navigate = useNavigate();  // Initialize useNavigate

  const handleRegister = async () => {
    try {
      const response = await register({
        variables: {
          user: {
            user_name: userName,
            email: email,
            password: password,
          },
        },
      });
      console.log(response.data);  // Log the response to the console
      setSuccessMessage('Registration successful');  // Set success message
      setTimeout(() => {
        navigate('/');  // Navigate to login page after a delay
      }, 2000);  // 2 seconds delay
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className="container">
        <h2 className="my-4">Register</h2>
        <div className="mb-3">
            <input
                type="text"
                className="form-control"
                placeholder="Username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
            />
        </div>
        <div className="mb-3">
            <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
        </div>
        <div className="mb-3">
            <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
        </div>
        <button className="btn btn-primary mb-3" onClick={handleRegister}>Register</button>
        <p>Already have an account? <Link className="text-primary" to="/">Login</Link></p>
        {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>} 
    </div>
);

};

export default RegisterPage;
