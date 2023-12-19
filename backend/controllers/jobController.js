import Jobs from '../models/jobModel.js'; // Assuming your job model is in a 'models' directory
import Bid from '../models/bidModel.js';
import Job from '../models/jobModel.js';
import FlatJob from '../models/flatModel.js';
import User from '../models/userModel.js';
export const createJob = async (req, res, next) => {
  try {
    const {userId, location, description, category, images, jobType, bidPrice } = req.body;


    // Check if required fields are present
    if (!location || !category || !description || !images || images.length === 0 || !jobType) {
      next("Location, category, description, images, and jobType are required");
      return;
    }
    if(!userId){
      next("userID is empty")
      return;
    }
    // If jobType is 'bid', check if bid field is present
    if (jobType === 'bid' && bidPrice === undefined) {
      next("Bid field is required for jobType 'bid'");
      return;
    }

    // Create a new job instance
    const newJobData = {
      createdBy: userId,
      description,
      location,
      category,
      images,
      jobType,
      userBid: jobType === 'bid' ? bidPrice : undefined,
      status: 'pending',
    };

    // Create a new job instance
    const newJob = new Jobs(newJobData);

    // Save the job to the database
    const savedJob = await newJob.save();

    res.status(201).json({
      success: true,
      message: "Successfully created a new job",
      data: savedJob,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};





export const getUnassignedJobsForLabour = async (req, res, next) => {
  try {
    const { userId, location, category } = req.body;

    // Retrieve jobs based on location, category, assignedTo is null, status is pending, and jobType is bid
    const userJobs = await Job.find({
      location: location,
      category: category,
      assignedTo: null,
      status: 'pending',
      jobType: 'bid',
    }).populate({
      path: 'createdBy',
      model: 'Users', // Assuming your user model is named 'Users'
      select: 'firstName lastName',
    });

    // Filter jobs where the user has not bid yet
    const filteredJobs = await Promise.all(
      userJobs.map(async (job) => {
        const bidCount = await Bid.countDocuments({
          job: job._id,
          bidder: userId,
        });

        // Include the job in the result only if the user has not bid yet
        return bidCount === 0 ? job : null;
      })
    );

    // Remove null entries from the filteredJobs array
    const finalJobs = filteredJobs.filter((job) => job !== null);

    res.status(200).json({
      success: true,
      message: 'Successfully retrieved user jobs',
      data: finalJobs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Route to update the stage of a job
export const updateJobStage = async (req, res, next) => {
  try {
    const { jobId,stage } = req.body;

    // Retrieve the job by jobId
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if the job is ongoing and assigned to someone
    if (job.status === 'ongoing' && job.assignedTo !== null) {
      // Update the job stage
      job.stage = stage;
      await job.save();
      res.json({ success: true, message: 'Job stage updated successfully' });
    } else {
      return res.status(400).json({ error: 'Invalid job status or not assigned to anyone' });
    }
  } catch (error) {
    console.error('Error updating job stage:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// add bidder to unassigned jobs
export const addBidder = async (req, res, next) => {
  try {
    const { bidderId, jobId, bidPrice } = req.body;
    console.log("req.body : ", req.body);
    // Check if required fields are present
    if (!bidderId || !jobId || !bidPrice) {
      return res.status(400).json({ message: 'BidderId, jobId, and bidPrice are required.' });
    }

    // Create a new bid instance
    const newBid = new Bid({
      job: jobId,
      bidder: bidderId,
      bidPrice: bidPrice,
    });

    // Validate the bid instance
    const validationError = newBid.validateSync();
    if (validationError) {
      const errors = Object.keys(validationError.errors).map(key => validationError.errors[key].message);
      return res.status(400).json({ message: 'Validation error', errors });
    }

    // Save the bid to the database
    const savedBid = await newBid.save();
    
    // Update the corresponding job with the new bid's _id
    await Job.findByIdAndUpdate(jobId, { $push: { bids: savedBid._id } });

    
    res.status(201).json({
      success: true,
      message: 'Successfully added a new bidder to the job',
      data: savedBid,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//unassigned flat jobs for user
export const unassignedFlatJobsforUser = async (req, res, next) => {
  try {
    const { userId } = req.body;

    // Find jobs with specified criteria
    const jobs = await Job.find({
      createdBy: userId,
      jobType: 'flat',
      assignedTo: null,
      status: 'pending',
      category: { $exists: true, $ne: null },
      location: { $exists: true, $ne: null },
    });
    // Find users with isPro true and matching location and category
    const matchingUsers = await User.find({
      isPro: true,
      location: { $in: jobs.map(job => job.location) },
      category: { $in: jobs.map(job => job.category) },
    }, 'firstName lastName feesPerHour location category ');
    // Combine job and user information
    const result = [];

    jobs.forEach(job => {
      matchingUsers.forEach(user => {
        if (
          user.location === job.location &&
          user.category === job.category
        ) {
          result.push({
            laborId: user._id,
            jobId: job._id,
            category: job.category,
            location: job.location,
            description: job.description,
            images: job.images,
            laborName: user.firstName + ' ' + user.lastName,
            feesPerHour: user.feesPerHour,
          });
        }
      });
    });
    console.log("Result before filtering:", result);

    // Get the list of jobIds and laborIds from FlatJob collection
    const flatJobEntries = await FlatJob.find({}, 'jobId laborId');

    // Filter out entries in the result where laborId and jobId match those in FlatJob
    const filteredResult = result.filter(item => {
      return !flatJobEntries.some(flatJob => (
        flatJob.jobId.toString() === item.jobId.toString() &&
        flatJob.laborId.toString() === item.laborId.toString()
      ));
    });

    console.log("Result after filtering:", filteredResult);
    res.status(200).json({
      success: true,
      message: 'Successfully retrieved jobs for the user',
      data: filteredResult,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


//confirm unassigned flat job from user 
export const confirmUnassignedFlatJobFromUser = async (req, res, next) => {
  try {
    const { laborId, jobId } = req.body;

    // Create a new FlatJob entry with the initial status set to 'confirmed'
    const newFlatJob = new FlatJob({
      laborId,
      jobId,
      status: 'pending',
    });

    const savedFlatJob = await newFlatJob.save();

    res.status(200).json({
      success: true,
      message: 'Flat job confirmation saved successfully',
      data: savedFlatJob,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// unassigned flat jobs for labor
export const unassignedFlatJobsforLabor = async (req, res, next) => {
try {
  const { userId } = req.body;

  // Find job entries in FlatJob schema based on the userId
  const flatJobs = await FlatJob.find({ laborId: userId });

  // If there are no matching flat jobs, return an empty response
  if (!flatJobs || flatJobs.length === 0) {
    return res.status(200).json({
      success: true,
      message: 'No flat jobs found for the user',
      data: [],
    });
  }

  // Fetch additional details from Job model, including createdBy user's name
  const flatJobDetails = await Promise.all(
    flatJobs.map(async (flatJob) => {
      const jobDetails = await Job.findById(flatJob.jobId).populate('createdBy', 'firstName lastName');

      return {
        jobId: jobDetails._id, // Include jobId for reference
        location: jobDetails.location,
        category: jobDetails.category,
        description: jobDetails.description,
        images: jobDetails.images,
        userName: `${jobDetails.createdBy.firstName} ${jobDetails.createdBy.lastName}`,
      };
    })
  );

  res.status(200).json({
    success: true,
    message: 'Flat job details retrieved successfully',
    data: flatJobDetails,
  });
} catch (error) {
  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
}
};

// assigned flat job
export const assignedFlatJob = async (req, res, next) => {
  try {
    const { jobId, laborId } = req.body;

    // Find the FlatJob entry by matching jobId and userId
    const flatJob = await FlatJob.findOne({ jobId: jobId, laborId: laborId });

    // If no FlatJob entry is found, return an error
    if (!flatJob) {
      return res.status(404).json({ success: false, message: 'FlatJob entry not found' });
    }

    // Find the job by jobId and ensure it is unassigned
    const job = await Job.findOne({ _id: jobId, assignedTo: null, status: 'pending' });

    // If no Job entry is found, return an error
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found or cannot be started' });
    }

    // Update the job status and assignedTo field
    job.status = 'ongoing';
    job.assignedTo = laborId;
    await job.save();
    await FlatJob.deleteMany({ jobId: jobId });
    res.status(200).json({ success: true, message: 'Job started successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getUnassignedJobsForUser = async (req, res, next) => {
  try {
    const { userId } = req.body;

    // Find unassigned jobs for the user
    const unassignedJobs = await Job.find({
      createdBy: userId,
      assignedTo: null,
      status: 'pending',
    });

    // Fetch bids for the unassigned jobs
    const jobIds = unassignedJobs.map(job => job._id);
    const bids = await Bid.find({ job: { $in: jobIds } }).populate('bidder', 'firstName lastName').exec();
    // Combine job and bid information
    const result = unassignedJobs.map(job => {
      const jobBids = bids.filter(bid => bid.job && bid.job.equals(job._id));
    
      if (jobBids.length > 0) {
        const firstBid = jobBids[0]; // Assuming there is only one bid per job
        const bidderName = `${firstBid.bidder.firstName} ${firstBid.bidder.lastName}`;
        const bidPrice = firstBid.bidPrice;
        const bidderId = firstBid.bidder._id;
    
        return {
          jobId: job._id,
          category: job.category,
          location: job.location,
          description: job.description,
          images: job.images,
          bidderId: bidderId,
          bidderName: bidderName,
          bidPrice: bidPrice,
        };
      } else {
        return null; // If no bids for the job
      }
    });
    
    const filteredResult = result.filter(item => item !== null);

    res.status(200).json({
      success: true,
      message: 'Successfully retrieved unassigned jobs with bids for the user',
      data: filteredResult,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




// get assigned jobs details
export const getAssignedJobs = async (req, res, next) => {
  try {
    const userId = req.body.userId;

    // Retrieve jobs where createdBy or assignedTo is the logged-in user and assignedTo is not null
    const userJobs = await Job.find({
      $and: [
        {
          $or: [{ createdBy: userId }, { assignedTo: userId }],
        },
        { assignedTo: { $ne: null } },
        { stage: { $ne: 'cancelled' } },
        { stage: { $ne: 'completed' } }, // Ensure stage is not cancelled
        { status: { $ne: 'cancelled' } }, // Ensure assignedTo is not null
      ],
    })
      .populate({
        path: 'createdBy assignedTo',
        model: 'Users',
        select: 'firstName lastName feesPerHour', // Include the necessary fields
      })
      .select('category location description images stage jobType userBid');
    // Modify the response data to include feesPerHour for assignedTo
    const modifiedUserJobs = userJobs.map(job => ({
      ...job.toObject(),
      assignedTo: {
        ...job.assignedTo.toObject(),
        feesPerHour: job.assignedTo.feesPerHour,
      },
    }));
    res.status(200).json({
      success: true,
      message: 'Successfully retrieved user jobs',
      data: modifiedUserJobs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//update status when job is finnished
export const UpdateStatusForCompleteJob = async (req, res, next) => {
  try {
    const { jobId } = req.body;

    // Update the job's status field to 'finished'
    const updatedJob = await Jobs.findByIdAndUpdate(
      jobId,
      { $set: { status: 'finished' , stage: 'completed'} },
      { new: true }
    ).populate('createdBy assignedTo');

    res.status(200).json({
      success: true,
      message: "Successfully updated job status to finished",
      data: updatedJob,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//assigning job to labour
export const assignJobToBidder = async (req, res, next) => {
  try {
    const { jobId, bidderId, bidPrice } = req.body;

    // Validate that bidPrice is a valid number
    if (isNaN(bidPrice) || bidPrice <= 0) {
      return res.status(400).json({ message: 'Bid price must be a valid positive number.' });
    }

    // Update the job with the assignedTo and userBid fields
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      {
        assignedTo: bidderId,
        userBid: bidPrice,
        status: 'ongoing',
      },
      { new: true } // To return the updated document
    );

    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Job assigned to bidder successfully',
      data: updatedJob,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



// update status when job is assigned to the employee
export const updateStatusForCancelledJobs = async (req, res, next) => {
  try {
    const { jobId } = req.body; // Assuming you have user information in the request


    // Update the job's status field for cancellation
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { $set: { status: 'cancelled' , stage: 'cancelled' } },
      { new: true }
    ).populate('createdBy');

    if (!updatedJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Successfully cancelled the ongoing job",
      data: updatedJob,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// retrieve history of all jobs 
export const getJobHistory = async (req, res, next) => {
  try {
    const { userId } = req.body;

    // Retrieve jobs where createdBy or assignedTo is the logged-in user and assignedTo is not null
    const userJobs = await Job.find({ 
      $or: [
        { createdBy: userId },
        { assignedTo: userId }
      ],
    })
      .populate({
        path: 'createdBy assignedTo',
        model: 'Users',
        select: 'firstName lastName',
      })
      .select('category location description images status jobType userBid');

    res.status(200).json({
      success: true,
      message: 'Successfully retrieved user jobs',
      data: userJobs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

