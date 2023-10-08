// src/pages/LoginPage.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';

// Define your mutation string based on your server's schema
const LOGIN_USER = gql`
  mutation Login($credentials: Credentials!) {
    login(credentials: $credentials) {
      token
      message
      user {
        id
        user_name
        email
      }
    }
  }
`;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [login, { data, loading, error }] = useMutation(LOGIN_USER);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
        const response = await login({
            variables: {
                credentials: {
                    username: username,
                    password: password,
                },
            },
        });
        console.log(response.data); // Log the response to the console

        if (response.data.login.message === 'Login successful') {
            setIsLoggedIn(true);
            sessionStorage.setItem('token', response.data.login.token);
            navigate('/mytrips', { state: { userId: response.data.login.user.id } });
        } 
    } catch (error) {
        setErrorMessage('Invalid username or password');
        console.log(error);
    }
};

 /* useEffect(() => {
    if (isLoggedIn) {
    
    }
  }, [isLoggedIn, navigate]); */

  return (
    <div className="container">
        <h2 className="my-4">Login</h2>
        <div className="mb-3">
            <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
        <button className="btn btn-primary mb-3" onClick={handleLogin}>Login</button>
        {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}
        <p>Don't have an account? <Link className="text-primary" to="/register">Sign Up</Link></p>
    </div>
);

  }

export default LoginPage;