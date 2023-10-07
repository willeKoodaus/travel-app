// activityResolvers.js
import { Types } from 'mongoose';
import activityModel from '../models/activityModel';
import { Trip } from '../../interfaces/Trip';

export default {
  /*Trip: {
    activity: async (parent: Trip) => {
      return await activityModel.findById(parent.accommodation);
    },
},*/
  Query: {
    activities: async () => {
      return await activityModel.find();
    },
    activityById: async (_parent: undefined, args: { id: Types.ObjectId }) => {
      return await activityModel.findById(args.id);
    },
  },
  Mutation: {
    createActivity: async (_parent: undefined, args: { input: any }) => {
      const activity = new activityModel(args.input);
      return await activity.save();
    },
    updateActivity: async (_parent: undefined, args: { id: Types.ObjectId, input: any }) => {
      return await activityModel.findByIdAndUpdate(args.id, args.input, { new: true });
    },
    deleteActivity: async (_parent: undefined, args: { id: Types.ObjectId }) => {
      return await activityModel.findByIdAndDelete(args.id);
    },
  },
};
