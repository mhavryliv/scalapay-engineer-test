import fetch from 'node-fetch'
import fs from 'fs'

const makeScalapayReqAndHandleRes = async (order) => {
  const res = await makeScalapayReq(order);
  if(res.message && res.message.errors) {
    handleScalapayAndThisValidityDisagreement(order, res);
  }
  return res;
}

/*
  Handles when this server has decided an order is valid and sent it to
  Scalapay, but Scalapay responds saying it's invalid.
  We track these occurances in ValidationErrors.json 
  to figure out what is wrong in our validation.
*/
const handleScalapayAndThisValidityDisagreement = (order, sclpayRes) => {
  const errFileJson = JSON.parse(fs.readFileSync('./ValidationErrors.json'));
  const errObj = {
    date: new Date(),
    order: order,
    scalaResponse: sclpayRes
  }
  errFileJson.push(errObj);
  fs.writeFileSync('./ValidationErrors.json', JSON.stringify(errFileJson));
}

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