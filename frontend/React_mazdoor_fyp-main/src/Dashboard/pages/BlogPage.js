import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import globalUser from '../../global-data';
import CircularProgress from '@mui/material/CircularProgress';



export default function HistoryPages() {
  const [jobHistory, setJobHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchJobHistory = async () => {
      try {
        const requestData = {
          userId: globalUser.userModel._id,
        };
        const response = await fetch('http://localhost:8800/jobs/job-history', {
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
    // Call the fetchJobHistory function
    fetchJobHistory();
  }, []); // The empty dependency array ensures that this effect runs once after the initial render
  return (
    <div>
    {loading && <CircularProgress />} 
      <TableContainer component={Paper} style={{ display: loading ? 'none' : 'block' }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell><h3>Created By</h3></TableCell>
            <TableCell><h3>Labor</h3></TableCell>
            <TableCell><h3>Category</h3></TableCell>
            <TableCell><h3>Location</h3></TableCell>
            <TableCell><h3>Status</h3></TableCell>
            <TableCell><h3>Job Type</h3></TableCell>
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
              <TableCell>{job.jobType}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
}
