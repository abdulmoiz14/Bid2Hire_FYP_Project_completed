import React, { useState } from 'react';
import { Field, Form, FormSpy } from 'react-final-form';
import Box from '@mui/material/Box';
import Typography from './modules/components/Typography';
import AppFooter from './modules/views/AppFooter';
import AppAppBar from './modules/views/AppAppBar';
import AppForm from './modules/views/AppForm';
import RFTextField from './modules/form/RFTextField';
import FormButton from './modules/form/FormButton';
import FormFeedback from './modules/form/FormFeedback';
import withRoot from './modules/withRoot';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { useNavigate } from 'react-router-dom'; 
import globalUser from '../global-data';

function LaborSignUp() {
  const [sent, setSent] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState('');
  const [selectedLocation, setSelectedLocation] = React.useState('');
  const [setError] = useState(null);
  const navigate = useNavigate();



  const validate = (values) => {
    
  };
  const handleNavigate = (e) => {
    navigate(`${e}`);
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  const handleSubmit = async (values) => {
    try {
      // Send a POST request to your backend authentication endpoint'
      const requestData = {
        userId: globalUser.userModel._id,
        location: selectedLocation,
        category: selectedOption,
        feesPerHour: values.pricePerHour,
      };
      const response = await fetch('http://localhost:8800/users/update-as-pro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      

      if (response.ok) {
        // Process the successful response
        setSent(true);
        handleNavigate('/home');
      } else {
        console.error('Error:', data.message);
        // Handle the error as needed
        setError(data.message);
      }
    } catch (error) {
      console.error('Error during API request:', error);
      // Handle the error as needed
      setError('Internal Server Error');
    }
  };

  
  return (
    <React.Fragment>
      <AppAppBar />
      <AppForm>
      <React.Fragment>
          <Typography variant="h3" gutterBottom marked="center" align="center">
            Become a professional
          </Typography>
        </React.Fragment>
        <Form
          onSubmit={handleSubmit}
          subscription={{ submitting: true }}
          validate={validate}
        >
          {({ handleSubmit: handleSubmit2, submitting }) => (
            <Box component="form" onSubmit={handleSubmit2} noValidate sx={{ mt: 6 }}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Location</InputLabel>
                <Select
                  value={selectedLocation}
                  onChange={handleLocationChange}
                >
                  <MenuItem value="lahore">lahore</MenuItem>
                  <MenuItem value="islamabad">islamabad</MenuItem>
                  <MenuItem value="karachi">karachi</MenuItem>
                  <MenuItem value="multan">multan</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Select Category</InputLabel>
                <Select
                  value={selectedOption}
                  onChange={handleOptionChange}
                >
                  <MenuItem value="electrician">Electrician</MenuItem>
                  <MenuItem value="carpenter">Carpenter</MenuItem>
                  <MenuItem value="cleaner">Cleaner</MenuItem>
                  <MenuItem value="labor">Labor</MenuItem>
                  <MenuItem value="motorMechanic">Motor Mechanic</MenuItem>
                  <MenuItem value="gardener">Gardener</MenuItem>
                  <MenuItem value="helpShifting">Help Shifting</MenuItem>
                  <MenuItem value="painter">Painter</MenuItem>
                  <MenuItem value="plumber">Plumber</MenuItem>
                </Select>
              </FormControl>
                      <Field
                        autoComplete="off"
                        component={RFTextField}
                        disabled={submitting || sent}
                        fullWidth
                        label="Price per hour"
                        margin="normal"
                        name="pricePerHour"
                        required
                        size="large"
                      />
              <FormSpy subscription={{ submitError: true }}>
                {({ submitError }) =>
                  submitError ? (
                    <FormFeedback error sx={{ mt: 2 }}>
                      {submitError}
                    </FormFeedback>
                  ) : null
                }
              </FormSpy>
              <FormButton
                sx={{ mt: 3, mb: 2 }}
                disabled={submitting || sent}
                size="large"
                color="secondary"
                fullWidth
              >
                {submitting || sent ? 'In progress…' : 'Sign In'}
              </FormButton>
            </Box>
          )}
        </Form>
      </AppForm>
      <AppFooter />
    </React.Fragment>
  );
}

export default withRoot(LaborSignUp);
