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
  console.log(res);
  expect(thrownErr).toBeNull();
  expect(res.message).toBeUndefined();
  expect(res).toHaveProperty('checkoutUrl');
});

