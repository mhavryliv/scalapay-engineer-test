import fetch from 'node-fetch'
import express from 'express'
import bodyParser from 'body-parser'
import { validateOrder } from './lib/validator.js'
const app = express()
app.use(bodyParser.json())

const port = 8123

app.post('/order', (req, res) => {
  const order = req.body;
  const validateResult = validateOrder(req.body);
  console.log(validateResult);

  res.send(validateResult);
})

app.listen(port, () => {
  console.log("Server listening at port: " + port);
})

// try doing a request to the scalapay server

const makeReq = (callback) => {
  console.log("About to make request");
  const url = 'https://staging.api.scalapay.com/v2/orders';
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer qhtfs87hjnc12kkos'
    },
    body: JSON.stringify({
      totalAmount: {currency: 'EUR', amount: '190.00'},
      consumer: {givenNames: 'Joe', surname: 'Havryliv'},
      billing: {
        countryCode: 'AU',
        name: 'Mark Havryliv',
        postcode: '2539',
        suburb: 'Mollymook Beach'
      },
      items: [
        {
          price: {currency: 'EUR', amount: '10.00'},
          quantity: 0,
          name: 'T-Shirt',
          category: 'clothes'
        }
      ],
      merchant: {
        redirectCancelUrl: 'https://portal.staging.scalapay.com/failure-url',
        redirectConfirmUrl: 'https://portal.staging.scalapay.com/success-url'
      }
    })
  };

  fetch(url, options)
    .then(res => res.json())
    .then(json => callback(json))
    .catch(err => callback('error:' + err));
}


