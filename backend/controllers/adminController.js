import Job from '../models/jobModel.js';
import Users from "../models/userModel.js";

export const getAllJobsHistory = async (req, res, next) => {
  try {
    // Retrieve all jobs
    const allJobs = await Job.find()
      .populate({
        path: 'createdBy assignedTo',
        model: 'Users',
        select: 'firstName lastName',
      })
      .select('category location description images status jobType userBid');

    res.status(200).json({
      success: true,
      message: 'Successfully retrieved all jobs',
      data: allJobs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

  export const getAllUsers = async (req, res, next) => {
    try {
      const allUsers = await Users.find();
  
      res.status(200).json({
        success: true,
        message: 'Successfully retrieved all users',
        data: allUsers,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  //delete user from database
  export const deleteUser = async (req, res) => {
    try {
      const userIdToDelete = req.body.userId;
  
      // Check if the user exists
      const userToDelete = await Users.findById(userIdToDelete);
  
      if (!userToDelete) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
  
      // Delete the user from the database
      await userToDelete.deleteOne();
  
      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
        deletedUser: userToDelete,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  };

  //deleting job from database
  export const deleteJob = async (req, res) => {
    try {
      const jobId = req.body.jobId;
  
      // Check if the job exists
      const jobToDelete = await Job.findById(jobId);
  
      if (!jobToDelete) {
        return res.status(404).json({
          success: false,
          message: 'Job not found',
        });
      }
  
      // Delete the job from the database
      await jobToDelete.deleteOne();
  
      res.status(200).json({
        success: true,
        message: 'Job deleted successfully',
        deletedJob: jobToDelete,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  };