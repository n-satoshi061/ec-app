import {CardElement} from '@stripe/react-stripe-js'
import { db } from '../../firebase';
import {push} from 'connected-react-router'
import {updateUserStateAction} from '../users/actions'

const headers = new Headers();
headers.set('Content-type', 'application/json');
const BASE_URL = ' https://ec-app-f17ae.web.app';

const createCustomer = async (email, paymentMethodId, uid) => {
  const response = await fetch(BASE_URL+'/v1/customer', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
          email: email,
          paymentMethod: paymentMethodId,
          userId: uid,
      })
  });

  const customerResponse = await response.json();
  return JSON.parse(customerResponse.body);
}

export const registerCard = (stripe, elements) => {
  return async(dispatch, getState) => {
    const user = getState().users;
    const email = user.email
    const uid = user.uid
    const username = user.username

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const cardElement = elements.getElement(CardElement);

    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });
    console.log(error)
    if (error) {
      console.log(error.message);
      return;
    }
    const paymentMethodId = paymentMethod.id;

    const customerData = await createCustomer(email, paymentMethodId, uid)

    if(customerData.id === "") {
      alert('カード情報の登録に失敗しました。')
      return;
    }else {
      const updateUserState = {
        customer_id: customerData.id,
        payment_method_id: paymentMethodId
      }
      db.collection('users').doc(uid)
        .update(updateUserState)
        .then(() => {
          dispatch(updateUserStateAction(updateUserState))
          dispatch(push('/user/mypage'))
        }).catch((error) => {
          // Delete stripe customer
          alert('カード情報の登録に失敗しました。')
          return;
        })
    }

  }
}