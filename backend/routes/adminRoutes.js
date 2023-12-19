// Import the Express Router
import express from 'express';

// Import the controller functions
import { deleteJob, deleteUser, getAllJobsHistory, getAllUsers } from '../controllers/adminController.js';

// Create a new Router instance
const router = express.Router();

// Define the route for getting all jobs history
router.post('/all-jobs-history', getAllJobsHistory);

// Define the route for getting all users
router.post('/all-users', getAllUsers);

// deleting user from database
router.delete('/delete-user', deleteUser);

// deleting job from database
router.delete('/delete-jobs', deleteJob);


// Export the router
export default router;
