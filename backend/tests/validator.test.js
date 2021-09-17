const validator = require('../lib/validator');

// Sanity checks of the validator
test('Empty data is invalid', () => {
  const res = validator.validate({});
  expect(res.valid).toBe(false);
  console.log(res.errors);
});

// Test with a valid order
test('Valid order', () => {
  const order = buildOrder();
  const res = validator.validate(order);
  expect(res.valid).toBe(true);
});

test('Invalid order: 1 top-level field missing', () => {
  const order = buildOrder();
  delete order.totalAmount;
  const res = validator.validate(order);
  expect(res.valid).toBe(false);
  expect(res.errors.summary.length).toBe(1);
  expect(res.errors.summary[0].field).toBe('totalAmount');
  expect(res.errors.summary[0].msg).toBe(validator.ErrMsgMissingField);
});

test('Invalid order: 1 child field missing', () => {
  const order = buildOrder();
  delete order.totalAmount.amount;
  const res = validator.validate(order);
  expect(res.valid).toBe(false);
  expect(res.errors.summary.length).toBe(1);
  expect(res.errors.summary[0].field).toBe('totalAmount.amount');
  expect(res.errors.summary[0].msg).toBe(validator.ErrMsgMissingField);
});

test('Invalid order: String value exceeds max', () => {
  const order = buildOrder();
  let longStr = "12345678901234567890";
  longStr = longStr + longStr + longStr + longStr;
  order.shipping.line1 = longStr;
  const res = validator.validate(order);
  expect(res.valid).toBe(false);
  expect(res.errors.summary.length).toBe(1);
  expect(res.errors.summary[0].field).toBe('shipping.line1');
  expect(res.errors.summary[0].msg).toBe(validator.ErrMsgFieldInvalid);
});

test('Invalid order: Invalide currency code', () => {
  const order = buildOrder();
  order.totalAmount.currency = "AUSD";
  const res = validator.validate(order);
  expect(res.valid).toBe(false);
  expect(res.errors.summary.length).toBe(1);
  expect(res.errors.summary[0].field).toBe('totalAmount.currency');
  expect(res.errors.summary[0].msg).toBe(validator.ErrMsgFieldInvalid);
});

// test('Invalid order: Items missing price, and price amount', () => {
//   // Build an order with at least 2 items
//   const order = buildOrder(2);
//   delete order.items[0].price.amount;
//   delete order.items[1].price;
//   const res = validator.validate(order);
//   expect(res.valid).toBe(false);
//   expect(res.errors.length).toBe(2);
//   expect(res.errors[0].field).toBe('totalAmount.currency');
//   expect(res.errors[0].msg).toBe(validator.ErrMsgFieldInvalid);
//   expect(res.errors[1].field).toBe('totalAmount.currency');
//   expect(res.errors[1].msg).toBe(validator.ErrMsgFieldInvalid);
// });

// test('Invalid order: Item quantity invalid', () => {

// });

// test('Invalid order: Random errors', () => {
//   const requiredSummaryObjects = validator.requiredSummaryObjects;
//   const requiredItemPurchaseInfo = validator.requiredItemPurchaseInfo;

//   // Build an order, then delete or set invalid data for random fields
// });

/*
Utility function to build orders for testing the validator
*/
const buildOrder = (minItems) => {
  // Initialise the order - amount is updated once all items have been generated
  let order = {
    totalAmount: {amount: 0, currency: "EUR"},
    consumer: {givenNames: "Mark Patrick", surname: "Havryliv"},
    shipping: {countryCode: "AU", name: "Mark Havryliv", postcode: "2539", line1: "95 Garside Road"}
  };
  // Initialise the items
  order.items = [];
  // Generate a random number of orders between 1-10
  let numItems = Math.floor(Math.random() * 10) + 1;
  // Unless overridden by @minItems argument
  if(minItems && numItems < minItems) {
    numItems = minItems;
  }
  // Keep a running sum of the total price
  let totalAmount = 0;
  for(let i = 0; i < numItems; ++i) {
    let item = {};
    item.quantity = Math.floor(Math.random() * 20) + 1;
    item.price = {
      amount: parseFloat((Math.random() * 200).toFixed(2)),
      currency: "EUR"
    }
    totalAmount += item.price.amount;
    item.name = "Converse Chuck Taylors";
    item.category = "Street shoes";
    item.sku = "12341234"

    // Add this item to the order
    order.items.push(item);
  }

  // Update the total amount
  order.totalAmount.amount = totalAmount;

  return order;
}