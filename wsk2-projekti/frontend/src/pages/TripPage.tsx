import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';

const GET_TRIP_BY_ID = gql`
  query GetTripById($tripId: ID!) {
    tripById(id: $tripId) {
      id
      destination
      startDate
      endDate
      flight {
        airline
        flightNumber
        departure
        arrival
        departureAirport
        arrivalAirport
      }
      accommodation {
        name
        address
        checkInDate
        checkOutDate
        bookingConfirmationNumber
      }
      activityList {
        id
        name
        date
        location
        description
      }
      packingList
    }
  }
`;


const TripPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const tripId = location.state.tripId;
  const userId = location.state.userId;
  const { loading, error, data } = useQuery(GET_TRIP_BY_ID, {
    variables: { tripId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const trip = data.tripById;

  return (
    <div>
      <h1>{trip.destination}</h1>
      <p>Start Date: {trip.startDate}</p>
      <p>End Date: {trip.endDate}</p>

      {/* Flight Info */}
      <h2>Flight Info</h2>
      {trip.flight ? (
      <div>
      <p>Airline: {trip.flight.airline}</p>
      <p>Flight Number: {trip.flight.flightNumber}</p>
      <p>Departure: {trip.flight.departure}</p>
      <p>Arrival: {trip.flight.arrival}</p>
      <p>Departure Airport: {trip.flight.departureAirport}</p>
      <p>Arrival Airport: {trip.flight.arrivalAirport}</p>
      <button onClick={() => navigate(`/edit-flight/${tripId}`)}>Edit Flight</button>
      <button onClick={handleRemoveFlight}>Remove Flight</button>
      </div>
      ) : (
        <div>
        <p>No flight information available</p>
        <button onClick={() => navigate(`/add-flight/${tripId}`)}>Add Flight</button>
        </div>
      )}

      {/* Accommodation Info */}
      <h2>Accommodation</h2>
      {trip.accommodation ? (
      <div>
      <p>Name: {trip.accommodation.name}</p>
      <p>Address: {trip.accommodation.address}</p>
      <p>Check In Date: {trip.accommodation.checkInDate}</p>
      <p>Check Out Date: {trip.accommodation.checkOutDate}</p>
      <p>Booking Confirmation Number: {trip.accommodation.bookingConfirmationNumber}</p>
      </div>
      ) : (
        <p>No accommodation information available</p>
      )}

      {/* Activities Info */}
      <h2>Activities</h2>
      {trip.activityList && trip.activityList.length > 0 ? (
       trip.activityList.map((activity: { name: string; date: string; location: string; description: string } , index: number) => (
        <div key={index}>
          <p>Name: {activity.name}</p>
          <p>Date: {activity.date}</p>
          <p>Location: {activity.location}</p>
          <p>Description: {activity.description}</p>
        </div>
      ))) : (
        <p>No activities information available</p>
      )}

      {/* Packing List */}
      <h2>Packing List</h2>
      {trip.packingList && trip.packingList.length > 0 ? (
      <ul>
        {trip.packingList.map((item: String, index: number) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
        ) : (
        <p>No items in packing list</p>
          )}
      <button onClick={() =>   navigate('/mytrips', { state: { userId: userId } })}>Back to My Trips</button>
    </div>
  );
};

export default TripPage;
