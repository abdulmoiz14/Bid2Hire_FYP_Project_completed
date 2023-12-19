import * as React from 'react';
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
import ImageUploading from 'react-images-uploading';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useNavigate } from 'react-router-dom'; 
import { useState } from 'react';
import mapApiDataToUser from '../model-mapping-function';
import globalUser from '../global-data';





function BidForm() {
  const [sent, setSent] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState('');
  const [images, setImages] = React.useState([]);
  const [jobType, setJobType] = React.useState('bid');
  const minNumber = 100;
  const [selectedLocation, setSelectedLocation] = React.useState('');
  const [error,setError] = useState(null);
  const navigate = useNavigate();



  const validate = (values) => {
    
  };


  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
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

  const handleRemoveImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  const handleJobTypeChange = (event) => {
    setJobType(event.target.value);
  };
  

  const handleSubmit = async (values) => {
    try {
      const requestData = {
        userId: globalUser.userModel._id,
        location: selectedLocation,
        description: values.description,
        category: selectedOption,
        images: images.map(image => ({ data_url: image.data_url })),
        jobType: jobType, // Assuming the bidType is stored in values.bidType
        bidPrice: values.price,
      };
      const response = await fetch('http://localhost:8800/jobs/create-job', {
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
        
        handleNavigate("/dashboard/blog");
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
            Post job
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
                label="Description"
                margin="normal"
                name="description" // Ensure that the name prop is set to "description"
                required
                size="large"
                multiline
                rows={4}
              />
              <ImageUploading
                multiple
                value={images}
                onChange={onChange}
                minNumber={minNumber}
                dataURLKey="data_url"
              >
                {({
                  imageList,
                  onImageUpload,
                  dragProps,
                }) => (
                  <div className="upload__image-wrapper" style={{ paddingTop: '10px' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                      }}
                      onClick={onImageUpload}
                      {...dragProps}
                    >
                      <CloudUploadIcon fontSize="large" />
                      <Typography variant="subtitle1">
                        Click or Drop here
                      </Typography>
                    </div>
                    {imageList.map((image, index) => (
                      <div key={index} className="image-item">
                        <img src={image['data_url']} alt="" width="100" />
                        <CloseIcon
                          className="remove-image-icon"
                          onClick={() => handleRemoveImage(index)}
                        />
                      </div>
                    ))}
                    </div>
                )}
              </ImageUploading>
                    <RadioGroup
                      value={jobType}
                      onChange={handleJobTypeChange}
                      row
                    >
                      <FormControlLabel
                        value="bid"
                        control={<Radio />}
                        label="Bid"
                      />
                      <FormControlLabel
                        value="flat"
                        control={<Radio />}
                        label="Flat"
                      />
                    </RadioGroup>
                    {jobType === 'bid' ? (
                      <Field
                        autoComplete="off"
                        component={RFTextField}
                        disabled={submitting || sent}
                        fullWidth
                        label="Price"
                        margin="normal"
                        name="price"
                        required
                        size="large"
                      />
                    ) : (
                      <Field
                        autoComplete="off"
                        component={RFTextField}
                        fullWidth
                        label="Price"
                        margin="normal"
                        name="price"
                        required
                        size="large"
                        disabled
                      />
                    )}
              



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

export default withRoot(BidForm);
