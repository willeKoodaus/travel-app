// flightResolvers.js
import { Types } from 'mongoose';
import flightModel from '../models/flightModel';

export default {
  Query: {
    flights: async () => {
      return await flightModel.find();
    },
    flightById: async (_parent: undefined, args: { id: Types.ObjectId }) => {
      return await flightModel.findById(args.id);
    },
  },
  Mutation: {
    createFlight: async (_parent: undefined, args: { input: any }) => {
      const flight = new flightModel(args.input);
      return await flight.save();
    },
    updateFlight: async (_parent: undefined, args: { id: Types.ObjectId, input: any }) => {
      return await flightModel.findByIdAndUpdate(args.id, args.input, { new: true });
    },
    deleteFlight: async (_parent: undefined, args: { id: Types.ObjectId }) => {
      return await flightModel.findByIdAndDelete(args.id);
    },
  },
};
