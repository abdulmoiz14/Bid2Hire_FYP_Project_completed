import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import globalUser from '../../global-data';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';

export default function UserPage() {
    const [jobDetails, setJobDetails] = useState([]);
    const [selectedStage, setSelectedStage] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);
    const [openViewDialog, setOpenViewDialog] = useState(false);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await fetchJobDetails();
          setJobDetails(data);
          // Assuming the API returns the current stage for each job
        } catch (error) {
          console.error('Error fetching job details:', error);
        }
      };
  
      fetchData();
    }, []);
  
    const handleViewDialogOpen = (job) => {
      setSelectedJob(job);
      setOpenViewDialog(true);
    };
  
    const handleClose = () => {
      setOpenViewDialog(false);
      setSelectedJob(null);
    };
  
  
  const fetchJobDetails = async () => {
    const requestData = {
        userId: globalUser.userModel._id,
      };
      const response = await fetch('http://localhost:8800/jobs/assigned-jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
    if (!response.ok) {
      throw new Error('Error fetching job details');
    }
    const responseData = await response.json();
    console.log("response :", responseData.data);
    return responseData.data;
  };

 

  const handleOkClick = (jobId) => {
    // API call to update job stage
    updateJobStageAPI(selectedStage, jobId)
      .then((response) => console.log('Job stage updated successfully:', response))
      .catch((error) => console.error('Error updating job stage:', error));
  };

  const updateJobStageAPI = async (stage, jobId) => {
    // Replace with your actual API call to update job stage
    const response = await fetch('http://localhost:8800/jobs/update-job-stage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jobId,stage }),
    });

    if (!response.ok) {
      throw new Error('Error updating job stage');
    }

    return response.json();
  };

  return (
    <div>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>
              <h3>Name</h3>
            </TableCell>
            <TableCell>
              <h3>Location</h3>
            </TableCell>
            <TableCell>
              <h3>Category</h3>
            </TableCell>
            <TableCell>
              <h3>Description</h3>
            </TableCell>
            <TableCell>
              <h3>Image</h3>
            </TableCell>
            <TableCell>
              <h3>Type</h3>
            </TableCell>
            <TableCell>
              <h3>Price</h3>
            </TableCell>
            <TableCell>
              <h3>Work Stage</h3>
            </TableCell>
            <TableCell>
              <h3>Action</h3>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {Array.isArray(jobDetails) && jobDetails.length > 0 ? (
            jobDetails.map((job, index) => (
            <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                <b>{job.createdBy?.firstName} {job.createdBy?.lastName}</b>
                </TableCell>
                <TableCell>{job.location}</TableCell>
                <TableCell>{job.category}</TableCell>
                <TableCell>
                <Button variant="outlined" color="primary" onClick={() => handleViewDialogOpen(job)}>
                  View Description
                </Button>
              </TableCell>
              <TableCell>
                {/* Display a list of images (you may need to customize this part based on your data structure) */}
                {job.images && job.images.map((image, i) => <img key={i} src={image} alt={`Image ${i}`} />)}
              </TableCell>
                <TableCell>{job.jobType}</TableCell>
                <TableCell>
                {job.jobType === 'bid' ? job.userBid : `${job.assignedTo?.feesPerHour}/H`}
              </TableCell>
                <TableCell>
              <Box>
              <FormControl fullWidth variant="standard">
                      <InputLabel id={`stage-label-${index}`}>Stage</InputLabel>
                      <Select
                        labelId={`stage-label-${index}`}
                        id={`stage-select-${index}`}
                        label="Stage"
                        value={selectedStage}
                        onChange={(e) => setSelectedStage(e.target.value)}
                      >
                        <MenuItem value="arrive">Arrive</MenuItem>
                        <MenuItem value="ongoing">Ongoing</MenuItem>
                        <MenuItem value="finished">Finished</MenuItem>
                      </Select>
                    </FormControl>
              </Box>
            </TableCell>
                <TableCell>
                <Button
                    style={{ marginRight: '20px', padding: '5px 15px', borderRadius: '10px' }}
                    variant="outlined" color="primary" sx={{ textTransform: 'none' }}
                    onClick={() => handleOkClick(job._id)}
                >
                    Update
                </Button>
                </TableCell>
            </TableRow>
            ))
        ) : (
            <TableRow>
            <TableCell colSpan={6} align="center">
                No job details available.
            </TableCell>
            </TableRow>
        )}
        </TableBody>

      </Table>
    </TableContainer>
    
    {/* Dialog for displaying description */}
    <Dialog open={openViewDialog} onClose={handleClose}>
      <DialogTitle>Job Description</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {selectedJob?.description || 'N/A'}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
    </div>
  );
};
