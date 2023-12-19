import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { Field, Form, FormSpy } from 'react-final-form';
import Typography from './modules/components/Typography';
import AppFooter from './modules/views/AppFooter';
import AppForm from './modules/views/AppForm';
import RFTextField from './modules/form/RFTextField';
import FormButton from './modules/form/FormButton';
import FormFeedback from './modules/form/FormFeedback';
import withRoot from './modules/withRoot';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate } from 'react-router-dom';
import { email} from './modules/form/validation';

function SignUp() {
  const navigate = useNavigate();
  const [sent, setSent] = React.useState(false);

  const handleNavigate = (e) => {
    navigate(`${e}`);
  };

  const validate = (values) => {
    const errors = {};
  
  // Check for required fields
  const requiredFields = ['firstName', 'lastName', 'email', 'phoneNo', 'dateOfBirth', 'password'];
  requiredFields.forEach((field) => {
    if (!values[field]) {
      errors[field] = 'This field is required';
    }
  });

  // Validate email
  if (values.email) {
    const emailError = email(values.email);
    if (emailError) {
      errors.email = emailError;
    }
  }
  };

  const handleSubmit = async (values) => {
    try {
      // Send a POST request to your backend registration endpoint
      const response = await fetch('http://localhost:8800/users/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        // Successful registration
        setSent(true);

        // Navigate to the home screen
        handleNavigate('/signin'); // Replace '/home' with the actual path of your home route
      } else {
        // Registration failed, set error state
        console.error('Registration failed:', data.message);
        // Handle the error as needed, e.g., display an error message to the user
      }
    } catch (error) {
      console.error('Error during registration:', error);
      // Handle the error as needed, e.g., display an error message to the user
    }
  };

  return (
    <React.Fragment>
      <AppForm>
        <React.Fragment>
          <Typography variant="h3" gutterBottom marked="center" align="center">
            Sign Up
          </Typography>
          <Typography variant="body2" align="center">
            <Link onClick={() => handleNavigate("/signin")} underline="always">
              Already have an account?
            </Link>
          </Typography>
        </React.Fragment>
        <Form onSubmit={handleSubmit} subscription={{ submitting: true }} validate={validate}>
          {({ handleSubmit: handleSubmit2, submitting }) => (
            <Box component="form" onSubmit={handleSubmit2} noValidate sx={{ mt: 6 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Field
                    autoFocus
                    component={RFTextField}
                    disabled={submitting || sent}
                    autoComplete="given-name"
                    fullWidth
                    label="First name"
                    name="firstName"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    component={RFTextField}
                    disabled={submitting || sent}
                    autoComplete="family-name"
                    fullWidth
                    label="Last name"
                    name="lastName"
                    required
                  />
                </Grid>
              </Grid>
              <Field
                autoComplete="email"
                component={RFTextField}
                disabled={submitting || sent}
                fullWidth
                label="Email"
                margin="normal"
                name="email"
                required
              />
              <Field
                autoComplete="phone no"
                component={RFTextField}
                disabled={submitting || sent}
                fullWidth
                label="Phone no"
                margin="normal"
                name="phoneNo"
                required
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date of birth"
                  name="dateOfBirth"
                  slotProps={{
                    textField: {
                      helperText: 'MM/DD/YYYY',
                    },
                  }}
                  required
                />
              </LocalizationProvider>
              <Field
                fullWidth
                component={RFTextField}
                disabled={submitting || sent}
                required
                name="password"
                autoComplete="new-password"
                label="Password"
                type="password"
                margin="normal"
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
                color="secondary"
                fullWidth
              >
                {submitting || sent ? 'In progress…' : 'Sign Up'}
              </FormButton>
            </Box>
          )}
        </Form>
      </AppForm>
      <AppFooter />
    </React.Fragment>
  );
}

export default withRoot(SignUp);
