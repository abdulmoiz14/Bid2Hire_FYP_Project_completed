import React, { useState , useEffect} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

export default function AdminUser() {
  const [userHistory, setUserHistory] = useState([]);


  useEffect(() => {
    const fetchUserHistory = async () => {
      try {

        const response = await fetch('http://localhost:8800/admin/all-users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          // If the response is successful, parse the JSON data
          const responseData = await response.json();

          if (Array.isArray(responseData.data)) {
            setUserHistory(responseData.data);

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
    fetchUserHistory();
  }, []); // The empty dependency array ensures that this effect runs once after the initial render
 

  const updateUserHistory = async () => {
    try {

      const response = await fetch('http://localhost:8800/admin/all-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        // If the response is successful, parse the JSON data
        const responseData = await response.json();

        if (Array.isArray(responseData.data)) {
          setUserHistory(responseData.data);

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
  const handleDeleteUser = async (userId) => {
    try {
      const requestData = {
        userId: userId,
      };
      const response = await fetch('http://localhost:8800/admin/delete-user', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      if (response.ok) {
        await updateUserHistory();
        // If the response is successful, parse the JSON data
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
              <TableCell><h3>Name</h3></TableCell>
              <TableCell><h3>Email</h3></TableCell>
              <TableCell><h3>Professional</h3></TableCell>
              <TableCell><h3>Fees per hour </h3></TableCell>
              <TableCell><h3>Category</h3></TableCell>
              <TableCell><h3>Location</h3></TableCell>
              <TableCell><h3>Action</h3></TableCell>
            </TableRow>
          </TableHead>

          {/* Body Work start */}
          <TableBody>
            {userHistory.map((user, index) => (
              <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                {/* Display job history data */}
                <TableCell>{user?.firstName || 'N/A'} {user?.lastName || 'N/A'}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.isPro ? 'Yes' : 'No'}</TableCell>
                <TableCell>{user.feesPerHour}</TableCell>
                <TableCell>{user.category || 'N/A'}</TableCell>
                <TableCell>{user.location || 'N/A'}</TableCell>
                <TableCell>
                  <Button variant="outlined" color="error" onClick={() => handleDeleteUser(user._id)} >delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
    );
}