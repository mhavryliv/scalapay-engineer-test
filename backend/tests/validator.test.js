const validator = require('../lib/validator');

// Sanity checks of the validator
test('Empty data is invalid', () => {
  const res = validator.validate({});
  expect(res.valid).toBe(false);
  console.log(res.errors);
});

// Test with a valid order
test('Valid order', () => {
  const order = orderBuilder();
  const res = validator.validate(order);
  expect(res.valid).toBe(true);
});

test('Invalid order: 1 top-level field missing', () => {
  const order = orderBuilder();
  delete order.totalAmount;
  const res = validator.validate(order);
  expect(res.valid).toBe(false);
  expect(res.errors.length).toBe(1);
  expect(res.errors[0].field).toBe('totalAmount');
});

test('Invalid order: 1 child field missing', () => {
  const order = orderBuilder();
  delete order.totalAmount.amount;
  const res = validator.validate(order);
  expect(res.valid).toBe(false);
  expect(res.errors.length).toBe(1);
  expect(res.errors[0].field).toBe('totalAmount.amount');
});

/*
Utility function to build orders for testing the validator
*/
const orderBuilder = () => {
  // Initialise the order - amount is updated once all items have been generated
  let order = {
    totalAmount: {amount: 0, currency: "EUR"},
    consumer: {givenNames: "Mark Patrick", surname: "Havryliv"},
    shipping: {countryCode: "AU", name: "Mark Havryliv", postcode: "2539", line1: "95 Garside Road"}
  };
  // Initialise the items
  order.items = [];
  // Generate a random number of orders between 1-10
  const numItems = Math.floor(Math.random() * 10) + 1;
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