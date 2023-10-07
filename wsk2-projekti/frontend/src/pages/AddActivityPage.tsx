import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';

const ADD_ACTIVITY_TO_TRIP = gql`
  mutation AddActivityToTrip($tripId: ID!, $input: ActivityInput!) {
    addActivityToTrip(tripId: $tripId, input: $input) {
      id
      activityList {
        id
        name
        date
        location
        description
      }
    }
  }
`;

const AddActivityPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const trip = location.state.trip;
  const tripId = trip.id;
  const userId = location.state.userId;

  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [locationText, setLocationText] = useState('');
  const [description, setDescription] = useState('');

  const [addActivityToTrip] = useMutation(ADD_ACTIVITY_TO_TRIP, {
    onCompleted: () => {
      navigate(`/trip/${tripId}`, { state: { tripId: tripId, userId: userId } });
    },
  });

  const handleAddActivity = async () => {
    const input = { name, date, location: locationText, description, trip: tripId };
    await addActivityToTrip({ variables: { tripId, input } });
  };

  return (
    <div>
      <h1>Add Activity</h1>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} placeholder="Date" />
      <input type="text" value={locationText} onChange={(e) => setLocationText(e.target.value)} placeholder="Location" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description"></textarea>
      <button onClick={handleAddActivity}>Add Activity</button>
    </div>
  );
};

export default AddActivityPage;
