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

export default function ProductsPage() {
  const [jobHistory, setJobHistory] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const requestData = {
          userId: globalUser.userModel._id,
        };

        const response = await fetch('http://localhost:8800/jobs/unassignedFlatJobsforUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        if (response.ok) {
          const responseData = await response.json();

          if (Array.isArray(responseData.data)) {
            setJobHistory(responseData.data);
          }
        } else {
          console.error('Error fetching job data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching job data:', error.message);
      }
    };

    fetchJobData();
  }, []); // The empty dependency array ensures that this effect runs once after the initial render

  const handleViewDialogOpen = (job) => {
    setSelectedJob(job);
    setOpenViewDialog(true);
  };

  useEffect(() => {
    console.log("history: ", jobHistory);
  }, [jobHistory]);
  
  const updateJobData = async () => {
    try {
      const requestData = {
        userId: globalUser.userModel._id,
      };

      const response = await fetch('http://localhost:8800/jobs/unassignedFlatJobsforUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const responseData = await response.json();

        if (Array.isArray(responseData.data)) {
          setJobHistory(responseData.data);
        }
      } else {
        console.error('Error fetching job data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching job data:', error.message);
    }
  };


  const handleConfirm = async (jobId, laborId) => {
    try {
      const requestData = {
        jobId : jobId,
        laborId : laborId,
      };

      const response = await fetch('http://localhost:8800/jobs/confirmunassignedjobsfromuser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
       await updateJobData();
      } else {
        console.error('Error updating the request:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating labor request:', error.message);
    }
  };
  const handleClose = () => {
    setOpenViewDialog(false);
    setSelectedJob(null);
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell><h3>Labor</h3></TableCell>
              <TableCell><h3>Category</h3></TableCell>
              <TableCell><h3>Location</h3></TableCell>
              <TableCell><h3>View Description</h3></TableCell>
              <TableCell><h3>Images</h3></TableCell>
              <TableCell><h3>Fees/H</h3></TableCell>
              <TableCell><h3>Action</h3></TableCell>
            </TableRow>
          </TableHead>

          {/* Body Work start */}
          <TableBody>
            {jobHistory.map((job, index) => (
              <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>{job.laborName}</TableCell>
                <TableCell>{job.category}</TableCell>
                <TableCell>{job.location}</TableCell>
                <TableCell>
                  <Button variant="outlined" color="primary" sx={{ textTransform: 'none' }} onClick={() => handleViewDialogOpen(job)}>View Description</Button>
                </TableCell>
                <TableCell>
                  {job.images && job.images.map((image, i) => <img key={i} src={image} alt={`Image ${i}`} />)}
                </TableCell>
                <TableCell>{job.feesPerHour}</TableCell>
                <TableCell>
                  <Button variant="outlined" color="primary" sx={{ textTransform: 'none' }} onClick={() => handleConfirm(job.jobId , job.laborId)}>Confirm</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
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
}
