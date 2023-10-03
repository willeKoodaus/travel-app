// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  const [register, { data, loading, error }] = useMutation(REGISTER_USER);  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');

  const handleRegister = async () => {
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
  };

  return (
    <div>
      <h2>Register</h2>
      <input
        type="text"
        placeholder="Username"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
      <p>Already have an account? <Link to="/">Login</Link></p>
    </div>
  );
};

export default RegisterPage;
