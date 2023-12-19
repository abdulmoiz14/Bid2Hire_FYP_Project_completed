import React, { useState , useEffect} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import globalUser from '../../global-data';
export default function HistoryPages() {
  const [jobHistory, setJobHistory] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openBidDialog, setOpenBidDialog] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  
  useEffect(() => {
    const fetchJobHistory = async () => {
      try {
        const requestData = {
          userId: globalUser.userModel._id,
          location: globalUser.userModel.location,
          category: globalUser.userModel.category,
        };
        const response = await fetch('http://localhost:8800/jobs/unassigned-jobs-for-labour', {
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
      const requestData = {
        userId: globalUser.userModel._id,
        location: globalUser.userModel.location,
        category: globalUser.userModel.category,
      };
      const response = await fetch('http://localhost:8800/jobs/unassigned-jobs-for-labour', {
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

  const handleBidDialogOpen = (job) => {
    setSelectedJob(job);
    setOpenBidDialog(true);
  };

  const handleClose = () => {
    setOpenViewDialog(false);
    setOpenBidDialog(false);
    setSelectedJob(null);
    setBidAmount('');
  };

  const handleBid = async () => {
    
    try {
      const requestData = {
        bidderId: globalUser.userModel._id,
        jobId: selectedJob._id,
        bidPrice: bidAmount,
      };    
      // Make an API call to update bid amount in the backend
      const response = await fetch(`http://localhost:8800/jobs/add-bidder-to-job`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
  
      if (response.ok) {
        // If the API call is successful, update the jobHistory state to remove the bid job
        setJobHistory((prevJobHistory) =>
          prevJobHistory.filter((job) => job.id !== selectedJob.id)
        );
        updateJobHistory();
      } else {
        console.error('Error updating bid amount:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating bid amount:', error.message);
    }
  
    handleClose();
  };
  
  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell><h3>Created By</h3></TableCell>
              <TableCell><h3>Category</h3></TableCell>
              <TableCell><h3>Location</h3></TableCell>
              <TableCell><h3>Price</h3></TableCell>
              <TableCell><h3>Description</h3></TableCell>
              <TableCell><h3>Images</h3></TableCell>
              <TableCell><h3>Action</h3></TableCell>
            </TableRow>
          </TableHead>

          {/* Body Work start */}
          <TableBody>
            {jobHistory.map((job, index) => (
              <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                {/* Display job history data */}
                <TableCell>{job.createdBy?.firstName } {job.createdBy?.lastName}</TableCell>
                <TableCell>{job.category}</TableCell>
                <TableCell>{job.location}</TableCell>
                <TableCell>{job.userBid}</TableCell>
                <TableCell>
                  <Button variant="outlined" color="primary" sx={{ textTransform: 'none' }} onClick={() => handleViewDialogOpen(job)}>View Description</Button>
                </TableCell>
                <TableCell>
                  {/* Display a list of images (you may need to customize this part based on your data structure) */}
                  {job.images && job.images.map((image, i) => <img key={i} src={image} alt={`Image ${i}`} />)}
                </TableCell>
                <TableCell>
                  <Button variant="outlined" color="primary" sx={{ textTransform: 'none' }} onClick={() => handleBidDialogOpen(job)}>Place Bid</Button>
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

      {/* Dialog for placing bid */}
      <Dialog open={openBidDialog} onClose={handleClose}>
        <DialogTitle>Place your bid</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {/* Display additional details if needed */}
            {/* ... */}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Bid Amount"
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleBid}>Place Bid</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
