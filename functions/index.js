const functions = require('firebase-functions');
const stripe = require('stripe')(functions.config().stripe.key);
const cors = require('cors');

const sendResponse = (response, statusCode, body) => {
  response.send({
      statusCode,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(body)
  });
};

// req {object} => {email: string, userId: string, paymentMethod: string}

exports.stripeCustomer = functions.https.onRequest((req, res) => {
  const corsHandler = cors({origin: true})

  corsHandler(req, res, () => {
    // POSTメソッドか判定
    if (req.method !== 'POST') {
      sendResponse(res, 405, {error: "Invalid Request method!"})
    }
    return stripe.customers.create({
      description: "EC App demo user",
      email: req.body.email,
      metadata: {userId: req.body.userId},
      payment_method: req.body.paymentMethod
    }).then((customer) => {
      sendResponse(res, 200, customer)
    }).catch((error) => {
      sendResponse(res, 500, {error: error})
    })
  })
})
