import {Types, Document} from 'mongoose';

// Activity interface
interface Activity extends Document {
    name: string;
    date: Date;
    location: string;
    description: string;
  }

  export {Activity};    