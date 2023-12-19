// jobRoutes.js
import express from 'express';
import {
  createJob,
  getUnassignedJobsForLabour,
  addBidder,
  getUnassignedJobsForUser,
  getAssignedJobs,
  UpdateStatusForCompleteJob,
  assignJobToBidder,
  updateStatusForCancelledJobs,
  getJobHistory,
  updateJobStage,
  unassignedFlatJobsforUser,
  confirmUnassignedFlatJobFromUser,
  unassignedFlatJobsforLabor,
  assignedFlatJob,

} from '../controllers/jobController.js';

const router = express.Router();

// Create a new job
router.post('/create-job', createJob);

// Get unassigned jobs for a labour
router.post('/unassigned-jobs-for-labour', getUnassignedJobsForLabour);

// Add bidder to a job
router.post('/add-bidder-to-job', addBidder);

// Route to update the stage of a job
router.post('/update-job-stage', updateJobStage);

// Get unassigned jobs for a user
router.post('/unassigned-jobs-for-user', getUnassignedJobsForUser);

// Get assigned jobs for a user
router.post('/assigned-jobs', getAssignedJobs);

//assigned flat job 
router.post('/assignedflatjob', assignedFlatJob);

//route to unassigned flat jobs for user
router.post('/unassignedFlatJobsforUser', unassignedFlatJobsforUser);

//router to unassigned  flat jobs for labor
//route to unassigned flat jobs for user
router.post('/unassignedFlatJobsforlabor', unassignedFlatJobsforLabor);

// confirm  unassigned flat jobs from user
router.post('/confirmunassignedjobsfromuser', confirmUnassignedFlatJobFromUser);

// Update status for a completed job
router.post('/update-status-for-complete-job', UpdateStatusForCompleteJob);

// Assign a job to a bidder
router.post('/assign-job-to-bidder', assignJobToBidder);

// Update status for cancelled jobs
router.post('/update-status-for-cancelled-jobs', updateStatusForCancelledJobs);

// Get job history for a user
router.post('/job-history', getJobHistory);

export default router;
