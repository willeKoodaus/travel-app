import React, { useState, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';

const CREATE_TRIP = gql`
  mutation CreateTrip($input: TripInput!) {
    createTrip(input: $input) {
      id
    }
  }
`;

const CreateTrip = () => {
  const location = useLocation();
  const userId = location.state ? location.state.userId : null;
  console.log(userId);
  
  const navigate = useNavigate();
  
  const [createTrip] = useMutation(CREATE_TRIP, {
    onCompleted: () => { 
      navigate('/mytrips', { state: { userId: userId } });
    },
  });
  
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const handleCreateTrip = async (event: FormEvent) => {
    event.preventDefault();
    const input = {
      user: userId,
      destination,
      startDate,
      endDate,
    };
    console.log(input);
    await createTrip({ variables: { input } });
  };
  
  const handleClose = () => {
    navigate('/mytrips', { state: { userId: userId } });
  };
  
  return (
    <div className="container">
      <h1 className="my-4">Create a New Trip</h1>
      <form onSubmit={handleCreateTrip}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <button type="submit" className="btn btn-primary">Create Trip</button>
          <button type="button" className="btn btn-secondary ml-2" onClick={handleClose}>Close</button>
        </div>
      </form>
    </div>
  );
};

export default CreateTrip;
