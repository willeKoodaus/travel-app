
import React from 'react';
import { Link } from 'react-router-dom';
 
const Home = () => {
    return (
        <div>
            <h1>This is homepage </h1>
            <Link to="/trip/">Go to trip page</Link>
        </div>
    );
};
 
export default Home;