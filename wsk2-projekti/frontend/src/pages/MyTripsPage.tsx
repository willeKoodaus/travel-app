import React from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';

const GET_USER_TRIPS = gql`
  query GetUserTrips($userId: ID!) {
    tripsByUser(userId: $userId) {
      id
      destination
      startDate
      endDate
    }
  }
`;

interface Trip {
    id: string;
    destination: string;
    startDate: string;  // Adjust the type if necessary
    endDate: string;    // Adjust the type if necessary
    // ...other fields you want to fetch
  }

const MyTrips = () => {
  const location = useLocation();
  const user = location.state.user;
  const userId = user.id; 
  const { loading, error, data } = useQuery(GET_USER_TRIPS, {
    variables: { userId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Here you can see your trips</h1>
      {data.tripsByUser.map((trip:Trip)=> (
        <div key={trip.id}>
          <h2>{trip.destination}</h2>
          <p>Start Date: {trip.startDate}</p>
          <p>End Date: {trip.endDate}</p>
          {/* Render other trip details as needed */}
        </div>
      ))}
    </div>
  );
};

export default MyTrips;