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

export default function UserPage() {
  const [jobDetails, setJobDetails] = useState([]);

  const [availableStages, setAvailableStages] = useState([]);

  useEffect(() => {
    // API call to fetch job details
    fetchJobDetails()
      .then((data) => {
        setJobDetails(data);
        // Assuming the API returns an array of available stages
        setAvailableStages(data.Stage || []);
      })
      .catch((error) => console.error('Error fetching job details:', error));
  }, []); // Empty dependency array ensures the effect runs only once on mount

  const fetchJobDetails = async () => {
    const response = await fetch('http://localhost:8800/jobs/assigned-jobs');
    if (!response.ok) {
      throw new Error('Error fetching job details');
    }
    return response.json(globalUser.userModel._id);
  };

  const handleStageChange = (event) => {
    setJobDetails((prevDetails) => ({ ...prevDetails, stage: event.target.value }));
  };

  const handleOkClick = (stage, jobId) => {
    // API call to update job stage
    updateJobStageAPI(stage, jobId)
      .then((response) => console.log('Js.ob stage updated successfully:', response))
      .catch((error) => console.error('Error updating job stage:', error));
  };

  const updateJobStageAPI = async (stage, jobId) => {
    // Replace with your actual API call to update job stage
    const response = await fetch('http://localhost:8800/jobs/update-job-stage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stage, jobId }),
    });

    if (!response.ok) {
      throw new Error('Error updating job stage');
    }

    return response.json();
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>
              <h3>Name</h3>
            </TableCell>
            <TableCell>
              <h3>Phone</h3>
            </TableCell>
            <TableCell>
              <h3>Category</h3>
            </TableCell>
            <TableCell>
              <h3>Type</h3>
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
        {jobDetails.map((job, index) => (
              <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                <b>{job.createdBy?.firstName } {job.createdBy?.lastName}</b>
              </TableCell>
              <TableCell>{job.category}</TableCell>
              <TableCell>{job.jobType}</TableCell>
              <TableCell>
                <Box>
                  <FormControl fullWidth variant="standard">
                    <InputLabel id="demo-simple-select-label">Stage</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Stage"
                      value={job.stage || ''}
                      onChange={handleStageChange}
                    >
                      {availableStages.map((stage) => (
                        <MenuItem key={stage} value={stage}>
                          {stage}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </TableCell>
              <TableCell>
                <Button
                  style={{ marginRight: '20px', padding: '5px 15px', borderRadius: '10px' }}
                  variant="contained"
                  onClick={() => handleOkClick(job.stage, job._id)}
                >
                  Ok
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
