import mongoose from "mongoose";

const bidSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job', // Reference to the 'Job' collection
    required: true,
  },
  bidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users', // Reference to the 'Users' collection (assuming this is your user model)
    required: true,
  },
  bidPrice: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Bid = mongoose.model('Bid', bidSchema);

export default Bid;
