import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import globalUser from '../../global-data';
import CircularProgress from '@mui/material/CircularProgress';

export default function OngoingUser() {
  const [jobHistory, setJobHistory] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch job history data from the API
    const fetchData = async () => {
        try {
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
            if (response.ok) {
              // If the response is successful, parse the JSON data
              const responseData = await response.json();

              if (Array.isArray(responseData.data)) {
                setJobHistory(responseData.data);
                setLoading(false);
              }
            } else {
              // If there's an error, handle it
              console.error('Error fetching job history:', response.statusText);
              setLoading(false);
            }
          } catch (error) {
            // Handle network errors or other exceptions
            console.error('Error fetching job history:', error.message);
            setLoading(false);
          }
    };

    // Call the fetchData function
    fetchData();
  }, []);

  const updateFetchData = async () => {
    try {
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
        if (response.ok) {
          // If the response is successful, parse the JSON data
          const responseData = await response.json();

          if (Array.isArray(responseData.data)) {
            setJobHistory(responseData.data);
            setLoading(false);
          }
        } else {
          // If there's an error, handle it
          console.error('Error fetching job history:', response.statusText);
          setLoading(false);
        }
      } catch (error) {
        // Handle network errors or other exceptions
        console.error('Error fetching job history:', error.message);
        setLoading(false);
      }
  };


  const handleViewDialogOpen = (job) => {
    setSelectedJob(job);
    setOpenViewDialog(true);
  };

  const handleClose = () => {
    setOpenViewDialog(false);
    setSelectedJob(null);
  };

  const handleCancel = async (job) => {
    try {
      const requestData = {
        jobId: job._id,
      };
      const response = await fetch('http://localhost:8800/jobs/update-status-for-cancelled-jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      if (response.ok) {
        // If the response is successful, parse the JSON data
        const responseData = await response.json();

        if (Array.isArray(responseData.data)) {
          setJobHistory(responseData.data);
          setLoading(false);
        }
        await updateFetchData();
      } else {
        // If there's an error, handle it
        console.error('Error fetching job history:', response.statusText);
        setLoading(false);
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error('Error fetching job history:', error.message);
      setLoading(false);
    }
  };

  const handleFinish = async (job) => {
    try {
      const requestData = {
        jobId: job._id,
      };
      const response = await fetch('http://localhost:8800/jobs/update-status-for-complete-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        // If the response is successful, parse the JSON data
        const responseData = await response.json();

        if (Array.isArray(responseData.data)) {
          setJobHistory(responseData.data);
          setLoading(false);
        }
        await updateFetchData();
      } else {
        // If there's an error, handle it
        console.error('Error fetching job history:', response.statusText);
        setLoading(false);
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error('Error fetching job history:', error.message);
      setLoading(false);
    }
  };

  return (
    <div>
    {loading && <CircularProgress />} 
      <TableContainer component={Paper} style={{ display: loading ? 'none' : 'block' }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell><h3>Labor</h3></TableCell>
            <TableCell><h3>Category</h3></TableCell>
            <TableCell><h3>Location</h3></TableCell>
            <TableCell><h3>Job Type</h3></TableCell>
            <TableCell><h3>Description</h3></TableCell>
            <TableCell><h3>Images</h3></TableCell>
            <TableCell><h3>Price</h3></TableCell>
            <TableCell><h3>Stage</h3></TableCell>
            <TableCell><h3>Action</h3></TableCell>
          </TableRow>
        </TableHead>

        {/* Body Work start */}
        <TableBody>
          {jobHistory.map((job, index) => (
            <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              {/* Display job history data */}
              <TableCell>{job.assignedTo?.firstName || 'N/A'} {job.assignedTo?.lastName || 'N/A'}</TableCell>
              <TableCell>{job.category}</TableCell>
              <TableCell>{job.location}</TableCell>
              <TableCell>{job.jobType}</TableCell>
              <TableCell>
                <Button variant="outlined" color="primary" onClick={() => handleViewDialogOpen(job)}>
                  View Description
                </Button>
              </TableCell>
              <TableCell>
                {/* Display a list of images (you may need to customize this part based on your data structure) */}
                {job.images && job.images.map((image, i) => <img key={i} src={image} alt={`Image ${i}`} />)}
              </TableCell>
              <TableCell>
                {job.jobType === 'bid' ? job.userBid : `${job.assignedTo?.feesPerHour}/H`}
              </TableCell>
              <TableCell> {job.stage} </TableCell>
              <TableCell>
              
              <Button
                    variant="outlined"
                    color="primary"
                    style={{ paddingBottom: '2px', width: 'calc(50% - 4px)' }} // Adjusted styles
                    disabled={job.stage !== 'finished'}
                    onClick={() => handleFinish(job)}
                  >
                    Finished
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    style={{ paddingTop: '2px', width: 'calc(50% - 4px)' }} // Adjusted styles
                    onClick={() => handleCancel(job)}
                  >
                    Cancel
                  </Button>
             </TableCell>
            </TableRow>
          ))}
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


