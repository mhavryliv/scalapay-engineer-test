import fetch from 'node-fetch'
import fs from 'fs'

/*
  Coordinates making the request to the Scalapay server, and handling any errors
*/
const makeScalapayReqAndHandleRes = async (order) => {
  const res = await makeScalapayReq(order);
  /* If Scalapay reports an error with the order, we make note of it for
    future debugging (i.e. our validation should have caught any errors before
    sending to Scalapay)
   */
  if(res.message && res.message.errors) {
    handleScalapayAndThisValidityDisagreement(order, res);
    let errors = convertScalapayErrorIntoLocalScheme(res.message.errors);
    return {
      errors: errors
    }
  }
  else {
    return res;
  }
}

/*
  Converts the Scalapay order error format into our error format
  for return to the frontend.
  Parse replace the 'field' array and replace with dot separated property selector
*/
const convertScalapayErrorIntoLocalScheme = (scalaErrs) => {
  let userAndShippingErrors = [];
  let itemErrors = [];
  scalaErrs.forEach(err=> {
    const topField = err.field[0];
    // If this is an item, create a new item error
    if(topField === "items") {
      const newItemErr = {
        itemIndex: err.field[1],
        // convert the array to dot notated property field
        field: err.field.slice(2).join("."),
        messages: err.messages
      }
      itemErrors.push(newItemErr);
    }
    else {
      const newUserAndShippingError = {
        field: err.field.join("."),
        messages: err.messages
      }
      userAndShippingErrors.push(newUserAndShippingError)
    }
  });
  const errors = {
    userAndShipping: userAndShippingErrors,
    items: itemErrors
  }
  return errors;
}

/*
  Handles when this server has decided an order is valid and sent it to
  Scalapay, but Scalapay responds saying it's invalid.
  We track these occurances in ValidationErrors.json 
  to figure out what is wrong in our validation.
*/
const handleScalapayAndThisValidityDisagreement = (order, scalaPayRes) => {
  const errFileJson = JSON.parse(fs.readFileSync('./ValidationErrors.json'));
  const errObj = {
    date: new Date(),
    order: order,
    scalaResponse: scalaPayRes
  }
  errFileJson.push(errObj);
  fs.writeFileSync('./ValidationErrors.json', JSON.stringify(errFileJson));
}

/*
  Make the request to Scalapay
*/
const makeScalapayReq = async (order) => {
  // Add the merchant fields to the order
  order.merchant = {
    redirectCancelUrl: 'https://portal.staging.scalapay.com/failure-url',
    redirectConfirmUrl: 'https://portal.staging.scalapay.com/success-url'
  }
  const url = 'https://staging.api.scalapay.com/v2/orders';
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer qhtfs87hjnc12kkos'
    },
    body: JSON.stringify(order)
  };

  try {
    let res = await fetch(url, options);
    let json = await res.json();
    return json;
  }
  catch(error) {
    throw error;
  }
}

export { makeScalapayReqAndHandleRes }