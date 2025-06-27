import mongoose from 'mongoose';

const { Schema } = mongoose;

const recentActivitySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyid:{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  promotionId: {
    type: Number,
    required: true
  },
  brandName: {
    type: String,
    required: true
  },
  eventTitle: {
    type: String,
    required: true
  },
  prizemoney: {
    type: Number,
    required: true
  },
  activityTime: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index on userId and activityTime (descending)
recentActivitySchema.index({ userId: 1, activityTime: -1 });


const RecentActivity = mongoose.model('RecentActivity', recentActivitySchema);

export default RecentActivity;
