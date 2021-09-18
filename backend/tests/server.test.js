import {buildOrder} from './orderBuilder.js'
import {makeScalapayReqAndHandleRes} from './../reqMaker.js'
import * as validator from './../lib/validator.js'

test('Valid data is valid with Scalapay', async () => {
  const order = buildOrder(1, 1);
  validator.validateOrder(order);
  let thrownErr = null;
  let res;
  try {
    res = await makeScalapayReqAndHandleRes(order);
  }
  catch(error) {
    thrownErr = error;
  }
  expect(thrownErr).toBeNull();
  expect(res.message).toBeUndefined();
  expect(res).toHaveProperty('checkoutUrl');
});

test('Invalid data is invalid with Scalapay', async () => {
  const order = buildOrder(1, 1);
  validator.validateOrder(order);
  delete order.totalAmount;
  let thrownErr = null;
  let res;
  try {
    res = await makeScalapayReqAndHandleRes(order);
  }
  catch(error) {
    thrownErr = error;
  }
  expect(res.message.errors).not.toBeUndefined();
});