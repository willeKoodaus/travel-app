import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery, gql, useMutation } from '@apollo/client';
import { useState, useEffect, useCallback } from 'react';

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

const REMOVE_ACTIVITY_FROM_TRIP = gql`
  mutation RemoveActivityFromTrip($tripId: ID!, $activityId: ID!) {
    removeActivityFromTrip(tripId: $tripId, activityId: $activityId) {
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


const ADD_ITEM_TO_PACKING_LIST = gql`
  mutation AddItemToPackingList($tripId: ID!, $item: String!) {
    addItemToPackingList(tripId: $tripId, item: $item) {
      id
      packingList
    }
  }
`;

const REMOVE_ITEM_FROM_PACKING_LIST = gql`
  mutation RemoveItemFromPackingList($tripId: ID!, $item: String!) {
    removeItemFromPackingList(tripId: $tripId, item: $item) {
      id
      packingList
    }
  }
`;


const TripPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const tripId = location.state.tripId;
    const userId = location.state.userId;
    const [newItem, setNewItem] = React.useState('');
    const [isFetchingAttractions, setIsFetchingAttractions] = useState(false);
    const { loading, error, data, refetch } = useQuery(TRIP_BY_ID, {
      variables: { tripId },
    });

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
  
      const [removeActivityFromTrip] = useMutation(REMOVE_ACTIVITY_FROM_TRIP, {
          onCompleted: () => {
            refetch();
          },
        });
  
    const [addItemToPackingList] = useMutation(ADD_ITEM_TO_PACKING_LIST, {
          onCompleted: () => {
            refetch();
          },
        });
  
    const [removeItemFromPackingList] = useMutation(REMOVE_ITEM_FROM_PACKING_LIST, {
          onCompleted: () => {
            refetch();
          },
        });
  
    const [suggestedAttractions, setSuggestedAttractions] = useState<{ name: string, description: string }[]>([]);
  
    const fetchAttractions = useCallback(async (destination: string) => {
        setIsFetchingAttractions(true);
        try {
          const response = await fetch('http://localhost:3003/gpt', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userMessage: `What are the top 5 attractions in ${destination}?`,
            }),
          });
          const data = await response.json();
          const attractionsDescriptions = data.text.split('\n\n');  // Split the string into an array
          const attractionsArray = attractionsDescriptions.map((description: string) => {
            const parts = description.split(': ');  // Split the name from the description
            return { name: parts[0], description: parts[1] };
          });
          setSuggestedAttractions(attractionsArray);
        } catch (error) {
          console.error('Error fetching attractions:', error);
        }
        setIsFetchingAttractions(false);  
      }, []);
    
    
      useEffect(() => {
        if (data && data.tripById) {
          fetchAttractions(data.tripById.destination);
        }
      }, [data, fetchAttractions]);
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const trip = data.tripById;



  
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
  
    const handleRemoveActivity = async (activityId: string) => {
      await removeActivityFromTrip({ variables: { tripId, activityId } });
    };
  
    const handleAddItem = async () => {
      if (newItem) {
        await addItemToPackingList({ variables: { tripId, item: newItem } });
        setNewItem('');  // Clear the text input
      }
    };
    
    const handleRemoveItem = async (item: string) => {
      await removeItemFromPackingList({ variables: { tripId, item } });
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
    <button onClick={() => navigate(`/add-activity/${tripId}`, {
    state: {
        trip: trip,
        userId: userId
    }
    })}>Add Activity</button>
    {trip.activityList && trip.activityList.length > 0 ? (
    trip.activityList.map((activity: { id: string; name: string; date: string; location: string; description: string } , index: number) => (
        <div key={index}>
        <p>Name: {activity.name}</p>
        <p>Date: {activity.date}</p>
        <p>Location: {activity.location}</p>
        <p>Description: {activity.description}</p>
        <button onClick={() => handleRemoveActivity(activity.id)}>Remove Activity</button>
        </div>
    ))
    ) : (
    <p>No activities information available</p>
    )}

      {/* Packing List */}
      <h2>Packing List</h2>
    <input type="text" value={newItem} onChange={(e) => setNewItem(e.target.value)} placeholder="Add item" />
    <button onClick={handleAddItem}>Add Item</button>
    {trip.packingList && trip.packingList.length > 0 ? (
    <ul>
        {trip.packingList.map((item: string, index: number) => (
        <li key={index}>
            {item}
            <button onClick={() => handleRemoveItem(item)}>Remove</button>
        </li>
        ))}
    </ul>
    ) : (
    <p>No items in packing list</p>
    )}

      {/* Suggested Attractions */}
      <h2>Suggested Attractions</h2>
      {isFetchingAttractions ? (
      <p>Loading...</p>
    ) : suggestedAttractions.length > 0 ? (
      <ul>
        {suggestedAttractions.map((attraction, index) => (
          <li key={index}>
            <strong>{attraction.name}</strong>: {attraction.description}
          </li>
        ))}
      </ul>
    ) : (
      <p>No suggested attractions available</p>
    )}

      <button onClick={() =>   navigate('/mytrips', { state: { userId: userId } })}>Back to My Trips</button>
    </div>
  );
};

export default TripPage;
