// tripResolvers.js
import { Types } from 'mongoose';
import tripModel from '../models/tripModel';
import { Flight } from '../../interfaces/Flight';
import { Accommodation } from '../../interfaces/Accommodation';
import { Activity } from '../../interfaces/Activity';

export default {
  /*Activity: {
    trip: async (parent: Activity) => {
      return await tripModel.findById(parent.trip);
    },
  },*/
  Flight: {
    trip: async (parent: Flight) => {
      return await tripModel.findById(parent.trip);
    },
  },
  Accommodation: {
    trip: async (parent: Accommodation) => {
      return await tripModel.findById(parent.trip);
    },
  },
  Query: {
    trips: async () => {
      return await tripModel.find();
    },
    tripById: async (_parent: undefined, args: { id: Types.ObjectId }) => {
      return await tripModel.findById(args.id);
    },
    tripsByUser: async (_parent: undefined, args: { userId: Types.ObjectId }) => {
      return await tripModel.find({ user: args.userId });
    },
  },
  Mutation: {
    createTrip: async (_parent: undefined, args: { input: any }) => {
      const trip = new tripModel(args.input);
      return await trip.save();
    },
    updateTrip: async (_parent: undefined, args: { id: Types.ObjectId, input: any }) => {
      return await tripModel.findByIdAndUpdate(args.id, args.input, { new: true });
    },
    deleteTrip: async (_parent: undefined, args: { id: Types.ObjectId }) => {
      return await tripModel.findByIdAndDelete(args.id);
    },
  },
};
