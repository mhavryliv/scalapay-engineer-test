// import fetch from 'node-fetch'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { validateOrder } from './lib/validator.js'
import {makeScalapayReqAndHandleRes} from './lib/reqMaker.js'
const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 8123

app.post('/order', (req, res) => {
  // Offload to standalone function for easier testing
  handleRequest(req.body, res);
})

const handleRequest = async (order, res) => {
  // Check validity, and handle a server error
  const validityResult = checkValidity(order);
  if(validityResult.serverError) {
    return res.status(400).send(validityResult);
  }
  // If the request is not valid, return the error result
  if(validityResult.valid === false) {
    return res.send(validityResult);
  }
  // If it was valid, send the order to the Scalapay server
  try {
    let result = await makeScalapayReqAndHandleRes(order);
    // If checkoutUrl is a field, the order was succesful
    if(result.checkoutUrl) {
      const goodResult = {
        valid: true,
        checkoutUrl: result.checkoutUrl
      }
      return res.send(goodResult);
    }
    else {
      // Something went wrong, and we should tell the user what Scalapay told us
      const badResult = {
        scalapayError: true,
        errors: result.errors
      }
      return res.send(badResult);
    }
  }catch(error) {
    return res.status(400).send({'serverError': error});
  }
}

const checkValidity = (order) => {
  try {
    const validateResult = validateOrder(order);
    return validateResult;
  }
  catch(error) {
    return {serverError: "Error validating order: " + error};
  }
}

app.listen(port, () => {
  console.log("Server listening at port: " + port);
})

