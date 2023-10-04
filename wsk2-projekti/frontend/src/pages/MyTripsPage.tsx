import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useEffect } from 'react';

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

const DELETE_TRIP = gql`
  mutation DeleteTrip($id: ID!) {
    deleteTrip(id: $id) {
      id
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
    const navigate = useNavigate();
    const userId = location.state.userId;
    const { loading, error, data, refetch } = useQuery(GET_USER_TRIPS, { variables: { userId } });
    useEffect(() => {
        refetch();
      }, []);
    const [deleteTrip] = useMutation(DELETE_TRIP, {
      refetchQueries: [{ query: GET_USER_TRIPS, variables: { userId } }],
    });
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
  
    const handleTripClick = (tripId: string) => {
      navigate(`/trip/${tripId}`);
    };
  
    const handleDeleteClick = async (tripId: string) => {
      await deleteTrip({ variables: { id: tripId } });
    };
  
    const handleEditClick = (tripId: string) => {
      navigate(`/edit-trip/${tripId}`);
    };

    const handleAddTripClick = () => {
        navigate('/create-trip', { state: { userId: userId } });
      };
  
    return (
      <div>
        <h1>Here you can see your trips</h1>
        <button onClick={handleAddTripClick}>Add Trip</button>
        {data.tripsByUser.map((trip:Trip) => (
          <div id="trip" key={trip.id} onClick={() => handleTripClick(trip.id)}>
            <h2>{trip.destination}</h2>
            <p>Start Date: {trip.startDate}</p>
            <p>End Date: {trip.endDate}</p>
            <button onClick={(e) => { e.stopPropagation(); handleEditClick(trip.id); }}>Edit</button>
            <button onClick={(e) => { e.stopPropagation(); handleDeleteClick(trip.id); }}>Remove</button>
          </div>
        ))}
      </div>
    );
  };
  
  export default MyTrips;