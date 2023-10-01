// accommodationResolvers.js
import { Types } from 'mongoose';
import accommodationModel from '../models/accommodationModel';

export default {
  Query: {
    accommodations: async () => {
      return await accommodationModel.find();
    },
    accommodationById: async (_parent: undefined, args: { id: Types.ObjectId }) => {
      return await accommodationModel.findById(args.id);
    },
  },
  Mutation: {
    createAccommodation: async (_parent: undefined, args: { input: any }) => {
      const accommodation = new accommodationModel(args.input);
      return await accommodation.save();
    },
    updateAccommodation: async (_parent: undefined, args: { id: Types.ObjectId, input: any }) => {
      return await accommodationModel.findByIdAndUpdate(args.id, args.input, { new: true });
    },
    deleteAccommodation: async (_parent: undefined, args: { id: Types.ObjectId }) => {
      return await accommodationModel.findByIdAndDelete(args.id);
    },
  },
};
