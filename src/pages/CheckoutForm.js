import { useElements, useStripe, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { ArrowForward } from '@mui/icons-material';
import axios from 'axios';
import React, { useState } from 'react';
import './styles.css';
import { TextField, Paper, Grid, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import StripeInput from '../components/StripeInput';

export default function PaymentForm() {
  const [success, setSuccess] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardNumberElement)
    });

    if (!error) {
      try {
        const { id } = paymentMethod;
        const response = await axios.post('http://localhost:4000/payment', {
          amount: 1000,
          id
        });

        if (response.data.success) {
          console.log('Successful payment');
          setSuccess(true);
        }
      } catch (error) {
        console.log('Error', error);
      }
    } else {
      console.log(error.message);
    }
  };

  const paperStyle = { padding: '30px 20px', width: 600, margin: '20px auto' };
  const marginTop = { marginTop: 10 };
  return (
    <center>
      <>
        {!success ? (
          <div className="rel">
            <Grid>
              <Paper elevation={20} style={paperStyle}>
                <Grid align="center" />
                <form>
                  <Alert severity="info" variant="filled">
                    <div align="left">Contribute $10 for Open Source.</div>
                    <div>Either pay from here or using invoice and get the receipt.</div>
                  </Alert>
                  <Grid item xs={12} />
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Card Number"
                      style={marginTop}
                      fullWidth
                      InputLabelProps={{
                        shrink: true
                      }}
                      InputProps={{
                        inputComponent: StripeInput,
                        inputProps: {
                          component: CardNumberElement
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Expiry Date"
                      style={marginTop}
                      InputLabelProps={{
                        shrink: true
                      }}
                      InputProps={{
                        inputComponent: StripeInput,
                        inputProps: {
                          component: CardExpiryElement
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} />
                  <Grid item xs={12} sm={6}>
                    <TextField
                      type="password"
                      fullWidth
                      label="CVV"
                      style={marginTop}
                      InputLabelProps={{
                        shrink: true
                      }}
                      InputProps={{
                        inputComponent: StripeInput,
                        inputProps: {
                          component: CardCvcElement
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} />
                  <Grid item xs={12} sm={6}>
                    <LoadingButton
                      loading={loading}
                      loadingPosition="start"
                      startIcon={<ArrowForward />}
                      fullWidth
                      variant="outlined"
                      onClick={handleSubmit}
                      style={marginTop}
                      // disabled
                    >
                      {loading ? 'Processing ...' : 'Pay'}
                    </LoadingButton>
                  </Grid>
                </form>
              </Paper>
            </Grid>
          </div>
        ) : (
          <Grid className="rel">
            <Paper elevation={20} style={paperStyle}>
              <Grid align="center" />
              <Alert severity="success">Your payment is Successful. Thanks for using our service.</Alert>
            </Paper>
          </Grid>
        )}
      </>
    </center>
  );
}
