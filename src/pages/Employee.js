import React, { useEffect, useState } from 'react';
import { FormikProvider, Form, useFormik } from 'formik';
import Backdrop from '@mui/material/Backdrop';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import { TextField, Paper, Grid, Slider, Container } from '@mui/material';
import moment from 'moment-timezone';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { LoadingButton, DatePicker, LocalizationProvider, DateTimePicker } from '@mui/lab';
import { Save } from '@mui/icons-material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import '../Styles/app.scss';
import { IMaskInput } from 'react-imask';
import { useDispatch, connect } from 'react-redux';
import AutocompleteWidget from '../components/Autocomplete/autocompletWidget';
import { LoadEmployeeForm } from '../redux/actions/employeeFormActions';
import ControlledOpenSelect from '../components/dropdown';
import ProminentAppBar from '../components/header/header';
import SkeletonSet from '../components/skeletons/SkeletonSet';
import RatingsWidget from '../components/RatingsWidget/RatingsWidget';

moment.tz.setDefault('Asia/Kuala_Lumpur');
const TextMaskCustom = React.forwardRef((props, ref) => {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="(#00) 000-0000"
      definitions={{
        '#': /[1-9]/
      }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

TextMaskCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

// formik starts

const initialValues = {
  id: '',
  fname: '',
  lname: '',
  doj: '',
  add: '',
  mob: '',
  email: '',
  rating: ''
};

const onSubmit = (values) => {
  console.log('Form data', values);
};

// validation
const validate = (values) => {
  const errors = {};

  if (!values.id) {
    errors.id = 'Required';
  } else if (!/^[0-9]{3}$/i.test(values.id)) {
    errors.id = 'Invalid ID';
  }

  if (!values.fname) {
    errors.fname = 'Required';
  } else if (!/^[a-zA-Z]+$/i.test(values.fname)) {
    errors.fname = 'First Name must contain letters';
  }

  if (!values.lname) {
    errors.lname = 'Required';
  } else if (!/^[a-zA-Z]+$/i.test(values.lname)) {
    errors.lname = 'Last Name must contain letters';
  }

  if (!values.doj) {
    errors.doj = 'Required';
  }

  if (!values.add) {
    errors.add = 'Required';
  }

  if (!values.mob) {
    errors.mob = 'Required';
  } else if (!/^\([2-9][\d]{2}\) [\d]{3}-[\d]{4}$/i.test(values.mob)) {
    errors.mob = 'Invalid Mobile Number (US Format)';
  }

  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(values.email)) {
    errors.email = 'Invalid email';
  }

  if (!values.rating) {
    errors.rating = 'Required';
  }
  return errors;
};

const Alert = React.forwardRef((props, ref) => <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />);

const marginTop = { marginTop: 10 };

function Employee(isFormLoaded) {
  // formik
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues,
    onSubmit,
    validate
  });

  // Snackbar Code Starts

  // Date Picker
  const [value, setValue] = useState(null);
  // date time picker
  const [dt, setdt] = useState(moment(new Date()).format());
  // SnackBar
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState('');
  const listExample = ['India', 'England', 'USA', 'Germany', 'Spain'];

  const handleClick = () => {
    setOpen(true);
    setLoading(true);
    closeloader();
    handleLoader();
  };

  const closeloader = () => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  // loader
  const [loader, setLoader] = useState(false);
  const handleLoader = () => {
    setLoader(true);
    closePageloader();
  };

  const closePageloader = () => {
    setTimeout(() => {
      setLoader(false);
    }, 2000);
  };

  useEffect(() => {
    dispatch(LoadEmployeeForm());
  }, [dispatch]);

  // Snackbar code ends
  const paperStyle = { padding: '30px 20px', width: 570, margin: '20px auto' };
  const skeletonSet = [
    { height: '40', width: '500', xs: 12, md: 12, lg: 12, xl: 12 },
    { height: '40', width: '100%', xs: 12, md: 6, lg: 6, xl: 6 },
    { height: '40', width: '100%', xs: 12, md: 6, lg: 6, xl: 6 },
    { height: '40', width: '100%', xs: 12, md: 6, lg: 6, xl: 6 },
    { height: '40', width: '100%', xs: 12, md: 6, lg: 6, xl: 6 },
    { height: '40', width: '500', xs: 12, md: 12, lg: 12, xl: 12 },
    { height: '40', width: '500', xs: 12, md: 12, lg: 12, xl: 12 },
    { height: '40', width: '500', xs: 12, md: 12, lg: 12, xl: 12 },
    { height: '40', width: '100%', xs: 12, md: 6, lg: 6, xl: 6 },
    { height: '40', width: '100%', xs: 12, md: 6, lg: 6, xl: 6 },
    { height: '40', width: '500', xs: 12, md: 12, lg: 12, xl: 12 },
    { height: '10', width: '500', xs: 12, md: 12, lg: 12, xl: 12 },
    { height: '40', width: '500', xs: 12, md: 12, lg: 12, xl: 12 }
    // { height: '20', circle: true, width: '20', xs: 12, md: 3, lg: 2, xl: 3 }
  ];
  const positionOptions = [
    { label: 'Technician', value: 1 },
    { label: 'Manager', value: 2 }
  ];

  if (!isFormLoaded.isFormLoaded) {
    return (
      <div>
        <div align="center" className="rel">
          <Grid>
            <Paper elevation={20} style={paperStyle}>
              <Grid align="center" />
              <FormikProvider value={formik}>
                <Form onSubmit={formik.handleSubmit}>
                  <Container>
                    <SkeletonSet elementArray={skeletonSet} loading={isFormLoaded} />
                  </Container>
                </Form>
              </FormikProvider>
            </Paper>
          </Grid>
        </div>
      </div>
    );
  }
  if (isFormLoaded.isFormLoaded)
    return (
      <div>
        <div>
          <Grid>
            <Paper elevation={20} style={paperStyle}>
              <Grid />
              <FormikProvider value={formik}>
                <Form onSubmit={formik.handleSubmit}>
                  <Container>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={12} lg={12} xl={12}>
                        <Alert severity="info">Fill Employee Details Below</Alert>
                      </Grid>
                      <Grid item xs={12} md={6} lg={6} xl={6}>
                        <TextField
                          id="outlined"
                          style={marginTop}
                          label="Employee ID"
                          // defaultValue=""
                          fullWidth
                          helperText={
                            formik.touched.id && formik.errors.id ? formik.errors.id : 'Enter 3-digit Employee ID'
                          }
                          error={Boolean(formik.touched.id && formik.errors.id)}
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          value={formik.values.id}
                          name="id"
                        />
                      </Grid>
                      <Grid item xs={12} md={6} lg={6} xl={6}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            style={{ width: '100%', maxWidth: '100%', minWidth: '20%', marginTop: 10 }}
                            fullWidth
                            inputFormat="dd-MM-yyyy"
                            label="Date of Joining"
                            value={value}
                            onChange={(newValue) => {
                              setValue(moment(newValue).format());
                            }}
                            renderInput={(params) => (
                              <TextField
                                style={{ width: '100%', maxWidth: '100%', minWidth: '20%', marginTop: 10 }}
                                {...params}
                              />
                            )}
                          />
                        </LocalizationProvider>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          id="outlined"
                          style={marginTop}
                          label="Employee First Name"
                          // defaultValue=""
                          fullWidth
                          helperText={formik.touched.fname && formik.errors.fname ? formik.errors.fname : ''}
                          error={Boolean(formik.touched.fname && formik.errors.fname)}
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          value={formik.values.fname}
                          name="fname"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          id="outlined"
                          style={marginTop}
                          label="Employee Last Name"
                          // defaultValue=""
                          fullWidth
                          helperText={formik.touched.lname && formik.errors.lname ? formik.errors.lname : ''}
                          error={Boolean(formik.touched.lname && formik.errors.lname)}
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          value={formik.values.lname}
                          name="lname"
                        />
                      </Grid>
                      <Grid item xs={12} md={12} lg={12} xl={12}>
                        <AutocompleteWidget options={positionOptions} label="Position" disablePortal autoSelect />
                      </Grid>
                      <Grid item xs={12} md={12} lg={12} xl={12}>
                        <div className="makeSticky">
                          <ProminentAppBar header="Address Details" textVarient="h6" height="30px" />
                        </div>
                        <TextField
                          id="outlined"
                          style={marginTop}
                          label="Employee Address"
                          // defaultValue=""
                          fullWidth
                          helperText={formik.touched.add && formik.errors.add ? formik.errors.add : ''}
                          error={Boolean(formik.touched.add && formik.errors.add)}
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          value={formik.values.add}
                          name="add"
                        />
                      </Grid>
                      <Grid item xs={12} md={12} lg={12} xl={12}>
                        <ControlledOpenSelect
                          label="Select Country"
                          li={listExample}
                          value={country}
                          handleSelectedValue={(event, value) => setCountry(value)}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          id="outlined"
                          style={marginTop}
                          label="Employee Mobile Number"
                          // defaultValue=""
                          fullWidth
                          helperText={formik.touched.mob && formik.errors.mob ? formik.errors.mob : 'In US format'}
                          error={Boolean(formik.touched.mob && formik.errors.mob)}
                          onBlur={formik.handleBlur}
                          value={formik.values.mob}
                          onChange={formik.handleChange}
                          name="mob"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          id="outlined"
                          style={marginTop}
                          label="Employee E-mail"
                          // defaultValue=""
                          fullWidth
                          helperText={formik.touched.email && formik.errors.email ? formik.errors.email : ''}
                          error={Boolean(formik.touched.email && formik.errors.email)}
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          value={formik.values.email}
                          name="email"
                        />
                      </Grid>
                      <Grid item xs={12} md={12} lg={12} xl={12}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DateTimePicker
                            style={{ width: '100%', maxWidth: '100%', minWidth: '20%', marginTop: 10 }}
                            inputFormat="dd-MM-yyyy"
                            renderInput={(props) => (
                              <TextField
                                style={{ width: '100%', maxWidth: '100%', minWidth: '20%', marginTop: 10 }}
                                {...props}
                              />
                            )}
                            label="Record Added On"
                            value={dt}
                            onChange={(newValue) => {
                              setdt(newValue);
                            }}
                          />
                        </LocalizationProvider>
                      </Grid>
                      <Grid item xs={12} md={12} lg={12} xl={12}>
                        <p align="left">Employee Rating</p>
                        <RatingsWidget
                          name="employee-ratings"
                          precision={1}
                          max={5}
                          onChange={(event, value) => {
                            console.log(event, value);
                          }}
                        />
                        <Slider
                          required
                          defaultValue={0}
                          valueLabelDisplay="auto"
                          step={1}
                          min={1}
                          max={10}
                          helperText="Between 1 to 10"
                        />
                      </Grid>
                      <Grid item xs={12} md={12} lg={12} xl={12}>
                        <LoadingButton
                          loading={loading}
                          fullWidth
                          loadingPosition="start"
                          startIcon={<Save />}
                          variant="outlined"
                          onClick={handleClick}
                          style={marginTop}
                        >
                          {loading ? 'Saving ...' : 'Save Employee Data'}
                        </LoadingButton>
                      </Grid>
                      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity="success">
                          Data Saved Successfully!
                        </Alert>
                      </Snackbar>
                    </Grid>
                  </Container>
                  <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={loader}
                    // onClick = {handleLoader}
                  >
                    <CircularProgress color="inherit" />
                  </Backdrop>
                </Form>
              </FormikProvider>
            </Paper>
          </Grid>
        </div>
      </div>
    );
}

function mapStateToProps(state) {
  const { isFormLoaded } = state.EmployeeReducer;
  return {
    isFormLoaded
  };
}

export default connect(mapStateToProps)(Employee);
