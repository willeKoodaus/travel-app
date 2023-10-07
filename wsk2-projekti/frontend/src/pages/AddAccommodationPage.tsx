// src/pages/AddAccommodationPage.tsx
import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate, useLocation } from 'react-router-dom';

const CREATE_ACCOMMODATION = gql`
  mutation CreateAccommodation($input: AccommodationInput!) {
    createAccommodation(input: $input) {
      id
      name
      address
      checkInDate
      checkOutDate
      bookingConfirmationNumber
    }
  }
`;

const AddAccommodationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state.userId;
  const trip = location.state.trip;
  const tripId = trip.id;

  const [addAccommodation] = useMutation(CREATE_ACCOMMODATION, {
    onCompleted: () => navigate(`/trip/${tripId}`,  {
        state: {
          tripId: tripId,
          userId: userId
        }
      }),
  });

  // State variables for each input field
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [bookingConfirmationNumber, setBookingConfirmationNumber] = useState('');

  const handleAddAccommodation = async () => {
    const input = { 
      name, 
      address, 
      checkInDate, 
      checkOutDate, 
      bookingConfirmationNumber,
      trip: tripId
    };
    await addAccommodation({ variables: { input } });
  };

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Address"
      />
      <input
        type="datetime-local"
        value={checkInDate}
        onChange={(e) => setCheckInDate(e.target.value)}
        placeholder="Check In Date"
      />
      <input
        type="datetime-local"
        value={checkOutDate}
        onChange={(e) => setCheckOutDate(e.target.value)}
        placeholder="Check Out Date"
      />
      <input
        type="text"
        value={bookingConfirmationNumber}
        onChange={(e) => setBookingConfirmationNumber(e.target.value)}
        placeholder="Booking Confirmation Number"
      />
      <button onClick={handleAddAccommodation}>Add Accommodation</button>
    </div>
  );
};

export default AddAccommodationPage;
