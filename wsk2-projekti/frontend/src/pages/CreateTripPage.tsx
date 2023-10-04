import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import { useLocation } from 'react-router-dom';
const CREATE_TRIP = gql`
  mutation CreateTrip($input: TripInput!) {
    createTrip(input: $input) {
      id
    }
  }
`;

const CreateTrip = () => {
    const navigate = useNavigate();
    const [createTrip] = useMutation(CREATE_TRIP, {
      onCompleted: () => navigate('/mytrips', { state: { userId: userId } }),
    });

    const location = useLocation();
    const userId = location.state.userId;
  
    const [destination, setDestination] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    // ... other state variables for trip fields
  
    const handleCreateTrip = async () => {
      const input = {
        user: userId,
        destination,
        startDate,
        endDate,
        // ... other trip fields
      };
      await createTrip({ variables: { input } });
    };
  
    const handleClose = () => {
      navigate('/mytrips', { state: { userId: userId } });
    };
  
    return (
      <div>
        <h1>Create a New Trip</h1>
        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        {/* ... other input fields for trip */}
        <button onClick={handleCreateTrip}>Create Trip</button>
        <button onClick={handleClose}>Close</button>
      </div>
    );
  };
  
  export default CreateTrip;
