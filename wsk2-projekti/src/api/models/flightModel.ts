import mongoose from 'mongoose';
import { Flight } from '../../interfaces/Flight';

const flightModel = new mongoose.Schema<Flight>({
  airline: { type: String, required: true },
  flightNumber: { type: String, required: true },
  departure: { type: Date, required: true },
  arrival: { type: Date, required: true },
  departureAirport: { type: String, required: true },
  arrivalAirport: { type: String, required: true },
});

export default mongoose.model<Flight>('Flight', flightModel);