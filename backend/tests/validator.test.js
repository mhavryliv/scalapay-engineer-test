import * as validator from './../lib/validator.js'
import {buildOrder} from './orderBuilder.js'

// Sanity checks of the validator
test('Empty data is invalid', () => {
  const res = validator.validateOrder({});
  expect(res.valid).toBe(false);
});

// Test with a valid order
test('Valid order', () => {
  const order = buildOrder(1);
  const res = validator.validateOrder(order);
  expect(res.valid).toBe(true);
});

test('Invalid order: No items', () => {
  const order = buildOrder();
  delete order.items;
  const res = validator.validateOrder(order);
  expect(res.valid).toBe(false);
  expect(res.errors.userAndShipping[0].code).toBe(validator.ErrMsgNoItems);
});

test('Invalid order: 1 top-level field missing', () => {
  const order = buildOrder();
  delete order.totalAmount;
  const res = validator.validateOrder(order);
  expect(res.valid).toBe(false);
  expect(res.errors.userAndShipping.length).toBe(1);
  expect(res.errors.userAndShipping[0].field).toBe('totalAmount');
  expect(res.errors.userAndShipping[0].code).toBe(validator.ErrMsgMissingField);
});

test('Invalid order: 1 child field missing', () => {
  const order = buildOrder();
  delete order.totalAmount.amount;
  const res = validator.validateOrder(order);
  expect(res.valid).toBe(false);
  expect(res.errors.userAndShipping.length).toBe(1);
  expect(res.errors.userAndShipping[0].field).toBe('totalAmount.amount');
  expect(res.errors.userAndShipping[0].code).toBe(validator.ErrMsgMissingField);
});

test('Invalid order: String value exceeds max', () => {
  const order = buildOrder();
  let longStr = "12345678901234567890";
  longStr = longStr + longStr + longStr + longStr;
  order.shipping.line1 = longStr;
  const res = validator.validateOrder(order);
  expect(res.valid).toBe(false);
  expect(res.errors.userAndShipping.length).toBe(1);
  expect(res.errors.userAndShipping[0].field).toBe('shipping.line1');
  expect(res.errors.userAndShipping[0].code).toBe(validator.ErrMsgFieldInvalid);
});

test('Invalid order: Invalid currency code', () => {
  const order = buildOrder();
  order.totalAmount.currency = "AUSD";
  const res = validator.validateOrder(order);
  expect(res.valid).toBe(false);
  expect(res.errors.userAndShipping.length).toBe(1);
  expect(res.errors.userAndShipping[0].field).toBe('totalAmount.currency');
  expect(res.errors.userAndShipping[0].code).toBe(validator.ErrMsgFieldInvalid);
});

test('Invalid order: Items missing price, and price amount', () => {
  // Build an order with at least 5 items
  const order = buildOrder(5);
  // Invalidate items 0 and 3
  delete order.items[0].price.amount;
  delete order.items[3].price;
  const res = validator.validateOrder(order);
  expect(res.valid).toBe(false);
  const itemErrors = res.errors.items;
  expect(itemErrors.length).toBe(2);
  expect(itemErrors[0].itemIndex).toBe(0);
  expect(itemErrors[0].errors[0].field).toBe('price.amount');
  expect(itemErrors[0].errors[0].code).toBe(validator.ErrMsgMissingField);
  expect(itemErrors[1].itemIndex).toBe(3);
  expect(itemErrors[1].errors[0].field).toBe('price');
  expect(itemErrors[1].errors[0].code).toBe(validator.ErrMsgMissingField);
});

test('Invalid order: Item quantity, and sku invalid', () => {
  const order = buildOrder(1);
  order.items[0].quantity = -1;
  let longStr = "12345678901234567890";
  longStr = longStr + longStr + longStr + longStr;
  order.items[0].sku = longStr;
  const res = validator.validateOrder(order);
  expect(res.valid).toBe(false);
  const itemErrors = res.errors.items;
  expect(itemErrors.length).toBe(1);
  expect(itemErrors[0].itemIndex).toBe(0);
  expect(itemErrors[0].errors.length).toBe(2);
  expect(itemErrors[0].errors[0].field).toBe('quantity');
  expect(itemErrors[0].errors[0].code).toBe(validator.ErrMsgFieldInvalid);
  expect(itemErrors[0].errors[1].field).toBe('sku');
  expect(itemErrors[0].errors[1].code).toBe(validator.ErrMsgFieldInvalid);
});

test('Invalid order: Item currency does not match total order currency', () => {
  const order = buildOrder(1, 1);
  order.items[0].price.currency = "AUD";
  const res = validator.validateOrder(order);
  expect(res.valid).toBe(false);
  const itemErrors = res.errors.items;
  expect(itemErrors.length).toBe(1);
  expect(itemErrors[0].errors[0].field).toBe('price.currency');
})
