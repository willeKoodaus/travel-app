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
    <div className="container">
      <h1 className="my-4">Add Activity</h1>
      <form>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
        </div>
        <div className="mb-3">
          <input
            type="datetime-local"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            value={locationText}
            onChange={(e) => setLocationText(e.target.value)}
            placeholder="Location"
          />
        </div>
        <div className="mb-3">
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          ></textarea>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleAddActivity}>Add Activity</button>
      </form>
    </div>
  );
  
};

export default AddActivityPage;
