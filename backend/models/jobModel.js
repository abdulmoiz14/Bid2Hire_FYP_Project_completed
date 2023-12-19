import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users', // Reference to the 'User' collection
    required: true,
  },
  description: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['electrician', 'carpenter', 'cleaner', 'labor', 'motorMechanic', 'gardener', 'helpShifting', 'painter', 'plumber'],
    required: true,
  },
  images: [
    {
      data_url: {
        type: String,
        required: true,
      },
    }
  ],
  jobType: {
    type: String,
    enum: ['flat', 'bid'], // Assuming two job types: 'flat' or 'bid'
    required: true,
  },
  userBid: {
    type: String,
    required: function() {
      return this.jobType === 'bid'; // Price is required only for 'flat' jobs
    },
  },
  stage: {
    type: String,
    enum: ['pending', 'arrive', 'ongoing', 'finished','cancelled','completed'], // Adjust as needed
    default: 'pending',
  },
  status: {
    type: String,
    enum: ['pending', 'ongoing', 'finished', 'cancelled'], // Adjust as needed
    default: 'pending',
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    default: null,
  },
  bids: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bid', // Reference to the 'Bid' collection
    }
  ],
});

const Job = mongoose.model('Job', jobSchema);

export default Job;
