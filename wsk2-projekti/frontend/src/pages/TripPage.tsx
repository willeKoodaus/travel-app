import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery, gql, useMutation } from '@apollo/client';
import { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom-styles.css';  


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

    function formatDate(dateString: string) {
        const date = new Date(dateString);
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
        const yyyy = date.getFullYear();
        return dd + '.' + mm + '.' + yyyy + ' ' + date.toTimeString().split(' ')[0].substring(0, 5);
    }
  
    return (
        <div className="container">
            <h1 className="my-4">{trip.destination}</h1>
            <p className="card-text">Start Date: {formatDate(trip.startDate)}</p>
            <p className="card-text">End Date: {formatDate(trip.endDate)}</p>
                
            {/* Flight Info */}
            <div className="card mb-4">
            <h2 className="my-4">Flight Info</h2>
            {trip.flight ? (
                <div className="mb-4">
                    <p>Airline: {trip.flight.airline}</p>
                    <p>Flight Number: {trip.flight.flightNumber}</p>
                    <p>Departure: {formatDate(trip.flight.departure)}</p>
                    <p>Arrival: {formatDate(trip.flight.arrival)}</p>
                    <p>Departure Airport: {trip.flight.departureAirport}</p>
                    <p>Arrival Airport: {trip.flight.arrivalAirport}</p>
                    <button className="btn btn-danger" onClick={() => handleRemoveFlight(trip.flight.id)}>Remove Flight</button>
                </div>
            ) : (
                <div className="mb-4">
                    <p>No flight information available</p>
                    <button className="btn btn-primary" onClick={() => navigate(`/add-flight/${tripId}`, {
                        state: {
                            trip: trip,
                            userId: userId
                        }
                    })}>Add Flight</button>
                </div>
            )}
            </div>
    
            {/* Accommodation Info */}
            <div className="card mb-4">
            <h2 className="my-4">Accommodation</h2>
            {trip.accommodation ? (
                <div className="mb-4">
                    <p>Name: {trip.accommodation.name}</p>
                    <p>Address: {trip.accommodation.address}</p>
                    <p>Check In Date: {formatDate(trip.accommodation.checkInDate)}</p>
                    <p>Check Out Date: {formatDate(trip.accommodation.checkOutDate)}</p>
                    <p>Booking Confirmation Number: {trip.accommodation.bookingConfirmationNumber}</p>
                    <button className="btn btn-danger" onClick={handleRemoveAccommodation}>Remove Accommodation</button>
                </div>
            ) : (
                <div className="mb-4">
                    <p>No accommodation information available</p>
                    <button className="btn btn-primary" onClick={() => navigate(`/add-accommodation/${tripId}`, {
                        state: {
                            trip: trip,
                            userId: userId
                        }
                    })}>Add Accommodation</button>
                </div>
            )}
            </div>
    
            {/* Activities Info */}
            <div className="card mb-4">
            <h2 className="my-4">Activities</h2>
            <button className="btn btn-primary mb-4" onClick={() => navigate(`/add-activity/${tripId}`, {
                state: {
                    trip: trip,
                    userId: userId
                }
            })}>Add Activity</button>
            {trip.activityList && trip.activityList.length > 0 ? (
                trip.activityList.map((activity: { id: string; name: string; date: string; location: string; description: string }, index: number) => (
                    <div className="mb-4" key={index}>
                        <p>Name: {activity.name}</p>
                        <p>Date: {formatDate(activity.date)}</p>
                        <p>Location: {activity.location}</p>
                        <p>Description: {activity.description}</p>
                        <button className="btn btn-danger" onClick={() => handleRemoveActivity(activity.id)}>Remove Activity</button>
                    </div>
                ))
            ) : (
                <p>No activities information available</p>
            )}
            </div>
    
            {/* Packing List */}
            <div className="card mb-4">
            <h2 className="my-4">Packing List</h2>
            <div className="input-group mb-4">
                <input type="text" className="form-control" value={newItem} onChange={(e) => setNewItem(e.target.value)} placeholder="Add item" />
                <div className="input-group-append">
                    <button className="btn btn-primary" onClick={handleAddItem}>Add Item</button>
                </div>
            </div>
            {trip.packingList && trip.packingList.length > 0 ? (
                <ul className="list">
                    {trip.packingList.map((item: string, index: number) => (
                        <li key={index}>
                            {item}
                            <button className="btn btn-danger float-right" onClick={() => handleRemoveItem(item)}>Remove</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No items in packing list</p>
            )}
            </div>
    
            {/* Suggested Attractions */}
            <h2 className="my-4">Suggested Attractions</h2>
            {isFetchingAttractions ? (
                <p>Loading...</p>
            ) : suggestedAttractions.length > 0 ? (
                <ul className="list-group mb-4">
                    {suggestedAttractions.map((attraction, index) => (
                        <li className="list-group-item" key={index}>
                            <strong>{attraction.name}</strong>: {attraction.description}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No suggested attractions available</p>
            )}
    
            <button className="btn btn-secondary" onClick={() => navigate('/mytrips', { state: { userId: userId } })}>Back to My Trips</button>
        </div>
    );
};

export default TripPage;
