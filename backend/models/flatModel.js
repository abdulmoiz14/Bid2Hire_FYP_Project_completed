import mongoose from "mongoose";


const flatJobSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job', // Assuming you have a Job model, adjust the ref as needed
    required: true,
  },
  laborId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model, adjust the ref as needed
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed'], // Add more statuses if needed
    default: 'pending',
  },
});

const FlatJob = mongoose.model('FlatJob', flatJobSchema);

export default FlatJob;
