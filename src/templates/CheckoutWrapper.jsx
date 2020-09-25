import React from 'react';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js/pure';
import {PaymentEdit} from '../components/payment'

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_51HULYaJfh4fknq1vajQOSF6M0D9iIVZxB68BqXdM5aeJKn3anur47Uah3v8WkzLW1JQL8v0oyvCBuAp7LYuaB9SC009MZrDnJp');

const CheckoutWrapper = () => {
  return(
    <Elements stripe={stripePromise}>
      <PaymentEdit />
    </Elements>
  )
}
export default CheckoutWrapper;