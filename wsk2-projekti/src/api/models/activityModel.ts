import mongoose from 'mongoose';
import { Activity } from '../../interfaces/Activity';

const activityModel = new mongoose.Schema<Activity>({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
});

export default mongoose.model<Activity>('Activity', activityModel);