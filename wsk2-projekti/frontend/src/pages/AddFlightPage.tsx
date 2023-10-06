// src/pages/AddFlightPage.tsx
import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate, useLocation } from 'react-router-dom';

const CREATE_FLIGHT = gql`
  mutation CreateFlight($input: FlightInput!) {
    createFlight(input: $input) {
      id
      airline
      flightNumber
      departure
      arrival
      departureAirport
      arrivalAirport
    }
  }
`;

const AddFlightPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state.userId;
  const trip = location.state.trip;
  const tripId = trip.id;
  console.log(trip);
  const [addFlight] = useMutation(CREATE_FLIGHT, {
    onCompleted: () => navigate(`/trip/${tripId}`,  {
        state: {
          tripId: tripId,
          userId: userId
        }
      }),
  });

  // State variables for each input field
  const [airline, setAirline] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [departureAirport, setDepartureAirport] = useState('');
  const [arrivalAirport, setArrivalAirport] = useState('');

  const handleAddFlight = async () => {
    const tripInput = {
        user: userId,
        flight: trip.flight,
        accommodation: trip.accommodation,
        startDate: trip.startDate,
        endDate: trip.endDate,
        activityList: trip.activityList,
        packingList: trip.packingList,
        destination: trip.destination
    };
    const input = { 
      airline, 
      flightNumber, 
      departure, 
      arrival, 
      departureAirport, 
      arrivalAirport,
      trip: tripId
    };
    await addFlight({ variables: { input } });
};

  return (
    <div>
      <input
        type="text"
        value={airline}
        onChange={(e) => setAirline(e.target.value)}
        placeholder="Airline"
      />
      <input
        type="text"
        value={flightNumber}
        onChange={(e) => setFlightNumber(e.target.value)}
        placeholder="Flight Number"
      />
      <input
        type="datetime-local"
        value={departure}
        onChange={(e) => setDeparture(e.target.value)}
        placeholder="Departure"
      />
      <input
        type="datetime-local"
        value={arrival}
        onChange={(e) => setArrival(e.target.value)}
        placeholder="Arrival"
      />
      <input
        type="text"
        value={departureAirport}
        onChange={(e) => setDepartureAirport(e.target.value)}
        placeholder="Departure Airport"
      />
      <input
        type="text"
        value={arrivalAirport}
        onChange={(e) => setArrivalAirport(e.target.value)}
        placeholder="Arrival Airport"
      />
      <button onClick={handleAddFlight}>Add Flight</button>
    </div>
  );
};

export default AddFlightPage;

