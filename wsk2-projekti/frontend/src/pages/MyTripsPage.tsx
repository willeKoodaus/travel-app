import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


const GET_USER_TRIPS = gql`
  query GetUserTrips($userId: ID!) {
    tripsByUser(userId: $userId) {
      id
      destination
      startDate
      endDate
      user {
        id
      }
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
    endDate: string;
    user: string   // Adjust the type if necessary
    // ...other fields you want to fetch
  }

  const MyTrips = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const userId = location.state.userId;
    const { loading, error, data, refetch } = useQuery(GET_USER_TRIPS, { variables: { userId } });
    useEffect(() => {
        refetch();
      }, [refetch]);
    const [deleteTrip] = useMutation(DELETE_TRIP, {
      refetchQueries: [{ query: GET_USER_TRIPS, variables: { userId } }],
    });
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
  
    const handleTripClick = (tripId: string) => {
      navigate(`/trip/${tripId}`, {  
        state: {
        tripId: tripId,
        userId: userId
      }});
    };
  
    const handleDeleteClick = async (tripId: string) => {
      await deleteTrip({ variables: { id: tripId } });
    };
  
    const handleEditClick = (tripId: string) => {
        navigate(`/edit-trip/${tripId}`, {
          state: {
            tripId: tripId,
            userId: userId
          }
        });
      };


    const handleAddTripClick = () => {
        navigate('/create-trip', { state: { userId: userId } });
      };

      function formatDate(dateString: string) {
        const date = new Date(dateString);
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
        const yyyy = date.getFullYear();
        return dd + '.' + mm + '.' + yyyy + ' ' + date.toTimeString().split(' ')[0].substring(0, 5);
    }
  
      return (
        <div className="container">
            <h1 className="my-4">Here you can see your trips</h1>
            <button className="btn btn-primary mb-4" onClick={handleAddTripClick}>Add Trip</button>
            {data.tripsByUser.map((trip:Trip) => (
                <div className="card mb-4" key={trip.id} onClick={() => handleTripClick(trip.id)}>
                    <div className="card-body">
                        <h2 className="card-title">{trip.destination}</h2>
                        <p className="card-text">Start Date: {formatDate(trip.startDate)}</p>
                        <p className="card-text">End Date: {formatDate(trip.endDate)}</p>
                        <button className="btn btn-secondary mr-2" onClick={(e) => { e.stopPropagation(); handleEditClick(trip.id); }}>Edit</button>
                        <button className="btn btn-danger" onClick={(e) => { e.stopPropagation(); handleDeleteClick(trip.id); }}>Remove</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MyTrips;