// Import necessary libraries and components
import * as React from 'react';
import { Field, Form, FormSpy } from 'react-final-form';
import Box from '@mui/material/Box';
import { useState } from 'react';
import Link from '@mui/material/Link';
import Typography from './modules/components/Typography';
import AppFooter from './modules/views/AppFooter';
import AppForm from './modules/views/AppForm';
import { email, required } from './modules/form/validation';
import RFTextField from './modules/form/RFTextField';
import FormButton from './modules/form/FormButton';
import FormFeedback from './modules/form/FormFeedback';
import withRoot from './modules/withRoot';
import { useNavigate } from 'react-router-dom';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import User from "../constant";
import { saveToken } from "../token";
import mapApiDataToUser from "../model-mapping-function";
import globalUser from '../global-data';

function SignIn() {
  const [user, setUser] = useState(User);
  const navigate = useNavigate();
  const [sent] = useState(false);
  const [error, setError] = useState(null);

  const handleNavigate = (e) => {
    navigate(`${e}`);
  };

  const validate = (values) => {
    const errors = required(['email', 'password'], values);

    if (!errors.email) {
      const emailError = email(values.email);
      if (emailError) {
        errors.email = emailError;
      }
    }

    return errors;
  };

  const handleSubmit = async (values) => {
    try {
      // Send a POST request to your backend authentication endpoint
      const response = await fetch('http://localhost:8800/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        // Successful login
        const userType = values.userType;
        const mappedUser = mapApiDataToUser(data.user, userType);

        globalUser.setUserModel(mappedUser);
        saveToken(data.token);
        console.log(globalUser.userModel);
        if (userType === 'labour') {
          navigate('/dashboard-labor/app');
        } else {
          navigate('/home');
        }
      } else {
        // Login failed, set error state
        setError(data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('Internal Server Error');
    }
  };

  return (
    <React.Fragment>
      <AppForm>
        <React.Fragment>
          <Typography variant="h3" gutterBottom marked="center" align="center">
            Sign In
          </Typography>
          <Typography variant="body2" align="center">
            {'Not a member yet? '}
            <Link onClick={() => handleNavigate("/signup")} underline="always">
              Not a member yet?
            </Link>
          </Typography>
        </React.Fragment>
        <Form onSubmit={(values, form) => handleSubmit(values, form)} subscription={{ submitting: true }} validate={validate}>
          {({ handleSubmit: handleSubmit2, submitting }) => (
            <Box component="form" onSubmit={handleSubmit2} noValidate sx={{ mt: 6 }}>
              <Field
                autoComplete="email"
                autoFocus
                component={RFTextField}
                disabled={submitting || sent}
                fullWidth
                label="Email"
                margin="normal"
                name="email"
                required
                size="large"
              />
              <Field
                fullWidth
                size="large"
                component={RFTextField}
                disabled={submitting || sent}
                required
                name="password"
                autoComplete="current-password"
                label="Password"
                type="password"
                margin="normal"
              />
              <Field name="userType" type="radio" value="user">
                {({ input }) => (
                  <FormControlLabel
                    control={<Radio {...input} />}
                    label="User"
                  />
                )}
              </Field>
              <Field name="userType" type="radio" value="labour">
                {({ input }) => (
                  <FormControlLabel
                    control={<Radio {...input} />}
                    label="Labour"
                  />
                )}
              </Field>
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
        <Typography align="center">
          <Link underline="always" href="/premium-themes/onepirate/forgot-password/">
            Forgot password?
          </Link>
        </Typography>
      </AppForm>
      <AppFooter />
    </React.Fragment>
  );
}

export default withRoot(SignIn);
