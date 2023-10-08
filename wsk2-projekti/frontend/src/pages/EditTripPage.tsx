import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';

// Define your GraphQL query to get the existing trip data
const GET_TRIP = gql`
  query GetTrip($tripId: ID!) {
    tripById(id: $tripId) {
      destination
      startDate
      endDate
    }
  }
`;

// Define your GraphQL mutation to update the trip
const UPDATE_TRIP = gql`
  mutation UpdateTrip($tripId: ID!, $input: TripInput!) {
    updateTrip(id: $tripId, input: $input) {
      destination
      startDate
      endDate
    }
  }
`;

const EditTripPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state.userId;
  const  tripId = location.state.tripId;
  const { loading, error, data } = useQuery(GET_TRIP, {
    variables: { tripId },
    skip: !tripId,
  });

  const [updateTrip] = useMutation(UPDATE_TRIP);

  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

 

  useEffect(() => {
    if (data && data.tripById) {
      setDestination(data.tripById.destination);
      setStartDate(data.tripById.startDate);
      setEndDate(data.tripById.endDate);
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = { user, destination, startDate, endDate };
    await updateTrip({ variables: { tripId, input } });
    navigate('/mytrips', { state: { userId: user } });
  };

  const handleClose = () => {
    navigate('/mytrips', { state: { userId: user } });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  
  return (
    <div className="container">
      <h1 className="my-4">Edit Trip</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="destination" className="form-label">Destination:</label>
          <input
            type="text"
            id="destination"
            className="form-control"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="startDate" className="form-label">Start Date:</label>
          <input
            type="date"
            id="startDate"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="endDate" className="form-label">End Date:</label>
          <input
            type="date"
            id="endDate"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Save</button>
      </form>
      <button id="closebutton" className="btn btn-secondary mt-3" onClick={handleClose}>Close</button>
    </div>
  );
};

export default EditTripPage;
