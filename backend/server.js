// import fetch from 'node-fetch'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { validateOrder } from './lib/validator.js'
const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 8123

app.post('/order', (req, res) => {
  // Offload to standalone function for easier testing
  handleRequest(req, res);
})

const handleRequest = (req, res) => {
  const order = req.body;
  // Check validity, and handle a server error
  const validityResult = checkValidity(order);
  if(validityResult.serverError) {
    return res.status(400).send(validityResult);
  }
  // If the request is not valid, return that
  if(validateResult.valid === false) {
    return res.send(validityResult);
  }
  // If it was valid, then send the order to the Scalapay server
  try {
    let result = await makeScalapayReqAndHandleRes(order);
  }catch(error) {
    res.status(400).send({'serverError': error});
  }
}

const checkValidity = (order) => {
  try {
    const validateResult = validateOrder(req.body);
    return validateResult;
  }
  catch(error) {
    return {serverError: "Error validating order: " + error};
  }
}

app.listen(port, () => {
  console.log("Server listening at port: " + port);
})


// try doing a request to the scalapay server

// const makeReq = (callback) => {
//   console.log("About to make request");
//   const url = 'https://staging.api.scalapay.com/v2/orders';
//   const options = {
//     method: 'POST',
//     headers: {
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//       Authorization: 'Bearer qhtfs87hjnc12kkos'
//     },
//     body: JSON.stringify({
//       totalAmount: {currency: 'EUR', amount: '190.00'},
//       consumer: {givenNames: 'Joe', surname: 'Havryliv'},
//       billing: {
//         countryCode: 'AU',
//         name: 'Mark Havryliv',
//         postcode: '2539',
//         suburb: 'Mollymook Beach'
//       },
//       items: [
//         {
//           price: {currency: 'EUR', amount: '10.00'},
//           quantity: 0,
//           name: 'T-Shirt',
//           category: 'clothes'
//         }
//       ],
//       merchant: {
//         redirectCancelUrl: 'https://portal.staging.scalapay.com/failure-url',
//         redirectConfirmUrl: 'https://portal.staging.scalapay.com/success-url'
//       }
//     })
//   };

//   fetch(url, options)
//     .then(res => res.json())
//     .then(json => callback(json))
//     .catch(err => callback('error:' + err));
// }


