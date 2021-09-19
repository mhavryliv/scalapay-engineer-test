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
  expect(res.errors.userAndShipping).not.toBeUndefined();
  expect(res.errors.userAndShipping[0].field).toBe("totalAmount");
});

test('Invalid item data is invalid with Scalapay', async () => {
  const order = buildOrder(2, 2);
  validator.validateOrder(order);
  delete order.items[1].price.currency;
  let thrownErr = null;
  let res;
  try {
    res = await makeScalapayReqAndHandleRes(order);
  }
  catch(error) {
    thrownErr = error;
  }
  expect(res.errors.items).not.toBeUndefined();
  expect(res.errors.items[0].field).toBe("price.currency");
  expect(res.errors.items[0].itemIndex).toBe(1);
});