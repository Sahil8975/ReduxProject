import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React from 'react';
import PaymentForm from './CheckoutForm';

const PUBLIC_KEY =
  'pk_test_51JXlfISCkztF6OcimgeMrGiWBPefUBAc3bQrlGRt8T6LSuUFCNRlwUQOBJrPvjks6S8Fgyyuxg2nwLITMLSWqdXG00rAf8Ho2j';

const stripeTestPromise = loadStripe(PUBLIC_KEY);

export default function StripeContainer() {
  return (
    <Elements stripe={stripeTestPromise}>
      <PaymentForm />
    </Elements>
  );
}
