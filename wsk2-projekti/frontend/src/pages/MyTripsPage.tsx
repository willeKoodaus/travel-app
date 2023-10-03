import React from 'react';
import { useLocation } from 'react-router-dom';
 
const MyTrips = () => {
    const location = useLocation();
  const user = location.state.user;

  return (
    <div>
      <h1>Here you can see your trips, {user.user_name}</h1>
    </div>
  );
};
 
export default MyTrips;