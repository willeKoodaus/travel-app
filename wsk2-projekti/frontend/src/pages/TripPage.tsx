import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery, gql, useMutation } from '@apollo/client';
import { useEffect } from 'react';

const TRIP_BY_ID = gql`
  query TripById($tripId: ID!) {
    tripById(id: $tripId) {
      id
      destination
      startDate
      endDate
      flight {
        id
        airline
        flightNumber
        departure
        arrival
        departureAirport
        arrivalAirport
      }
      accommodation {
        id
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

const DELETE_FLIGHT = gql`
  mutation DeleteFlight($flightId: ID!) {
    deleteFlight(id: $flightId) {
      id
    }
  }
`;

const DELETE_ACCOMMODATION = gql`
  mutation DeleteAccommodation($accommodationId: ID!) {
    deleteAccommodation(id: $accommodationId) {
      id
    }
  }
`;

const TripPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const tripId = location.state.tripId;
  const userId = location.state.userId;
  const { loading, error, data, refetch } = useQuery(TRIP_BY_ID, {
    variables: { tripId },
  });
  useEffect(() => {
    refetch();
    console.log(data);
  }, [data, refetch]);
  const [deleteFlight] = useMutation(DELETE_FLIGHT, {
    onCompleted: () => {
        refetch();
      },
    });
  const [deleteAccommodation] = useMutation(DELETE_ACCOMMODATION, {
    onCompleted: () => {
        refetch();
      },
    });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const trip = data.tripById;
  console.log(trip);

  const handleRemoveFlight = async (flightId: string) => {
    try {
      await deleteFlight({ variables: { flightId } });
    } catch (error) {
      console.error('Error removing flight:', error);
    }
  };

  const handleRemoveAccommodation = async () => {
    if (trip.accommodation) {
      await deleteAccommodation({ variables: { accommodationId: trip.accommodation.id } });
    }
  };

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
      <button onClick={() => handleRemoveFlight(trip.flight.id)}>Remove Flight</button>
      </div>
      ) : (
        <div>
        <p>No flight information available</p>
        <button onClick={() => navigate(`/add-flight/${tripId}`, {
          state: {
            trip: trip,
            userId: userId
          }
        })}>Add Flight</button>
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
      <button onClick={handleRemoveAccommodation}>Remove Accommodation</button>
      </div>
      ) : (
        <div>
        <p>No accommodation information available</p>
        <button onClick={() => navigate(`/add-accommodation/${tripId}`, {
          state: {
            trip: trip,
            userId: userId
  }
})}>Add Accommodation</button>
        </div>
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
