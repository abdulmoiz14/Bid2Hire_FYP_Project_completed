// Import the Express Router
import express from 'express';

// Import the controller functions
import { changePassword, login, logout, signUp, updateUserAsPro } from '../controllers/userController.js';

// Create a new Router instance
const router = express.Router();

// Define the route for changing password
router.post('/change-password', changePassword);

// Define the route for user sign-up
router.post('/sign-up', signUp);

// Define the route for updating user as Pro
router.post('/update-as-pro', updateUserAsPro);

// POST request to /login
router.post('/login', login);

//post request to logout
router.post('/logout', logout);

// Export the router
export default router;
