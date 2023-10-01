import { Document } from 'mongoose';

interface Flight extends Document{
    airline: string;
    flightNumber: string;
    departure: Date;
    arrival: Date;
    departureAirport: string;
    arrivalAirport: string;
  }

export {Flight};