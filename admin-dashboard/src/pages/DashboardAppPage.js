import React, { useState , useEffect} from 'react';
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
export default function UserBidding() {
  const [jobHistory, setJobHistory] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);

  useEffect(() => {
    const fetchJobHistory = async () => {
      try {

        const response = await fetch('http://localhost:8800/admin/all-jobs-history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          // If the response is successful, parse the JSON data
          const responseData = await response.json();
          console.log("fetch Data:", responseData);
          if (Array.isArray(responseData.data)) {
            setJobHistory(responseData.data);
            console.log("Job history state updated:", responseData.data);
          }
        } else {
          // If there's an error, handle it
          console.error('Error fetching job history:', response.statusText);
        }
      } catch (error) {
        // Handle network errors or other exceptions
        console.error('Error fetching job history:', error.message);
      }
    };
    // Call the fetchJobHistory function
    fetchJobHistory();
  }, []); // The empty dependency array ensures that this effect runs once after the initial render
  const updateJobHistory = async () => {
    try {

      const response = await fetch('http://localhost:8800/admin/all-jobs-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        // If the response is successful, parse the JSON data
        const responseData = await response.json();

        if (Array.isArray(responseData.data)) {
          setJobHistory(responseData.data);
        }

      } else {
        // If there's an error, handle it
        console.error('Error fetching job history:', response.statusText);
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error('Error fetching job history:', error.message);
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

  const handleDeleteJob = async (jobId) => {
    try {
      const requestData = {
        jobId: jobId,
      };
      const response = await fetch('http://localhost:8800/admin/delete-jobs', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      if (response.ok) {
        // If the response is successful, parse the JSON data
        await updateJobHistory();
      } else {
        // If there's an error, handle it
        console.error('Error fetching job history:', response.statusText);
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error('Error fetching job history:', error.message);
    }
  };

return (

    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell><h3>Created by</h3></TableCell>
              <TableCell><h3>labor</h3></TableCell>
              <TableCell><h3>Category</h3></TableCell>
              <TableCell><h3>Location</h3></TableCell>
              <TableCell><h3>status</h3></TableCell>
              <TableCell><h3>Description</h3></TableCell>
              <TableCell><h3>Images</h3></TableCell>
              <TableCell><h3>Price</h3></TableCell>
              <TableCell><h3>Action</h3></TableCell>
            </TableRow>
          </TableHead>

          {/* Body Work start */}
          <TableBody>
            {jobHistory.map((job, index) => (
              <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                {/* Display job history data */}
                <TableCell>{job.createdBy?.firstName || 'N/A'} {job.createdBy?.lastName || 'N/A'}</TableCell>
      <TableCell>{job.assignedTo?.firstName || 'N/A'} {job.assignedTo?.lastName || 'N/A'}</TableCell>
                <TableCell>{job.category}</TableCell>
                <TableCell>{job.location}</TableCell>
                <TableCell>{job.status}</TableCell>
                <TableCell>
                  <Button variant="outlined" color="primary"  onClick={() => handleViewDialogOpen(job)}>View Description</Button>
                </TableCell>
                <TableCell>
                  {/* Display a list of images (you may need to customize this part based on your data structure) */}
                  {job.images && job.images.map((image, i) => <img key={i} src={image} alt={`Image ${i}`} />)}
                </TableCell>
                <TableCell>{job.userBid}</TableCell>
                <TableCell>
                  <Button variant="outlined" color="error" onClick={() => handleDeleteJob(job._id)}>delete</Button>
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
}