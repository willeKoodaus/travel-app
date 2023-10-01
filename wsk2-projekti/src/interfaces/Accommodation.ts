import {Types, Document} from 'mongoose';

interface Accommodation extends Document{
    name: string;
    address: string;
    checkInDate: Date;
    checkOutDate: Date;
    bookingConfirmationNumber: string;
  }

export {Accommodation};