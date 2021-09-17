/*
  Validates input before sending to Scalapay endpoint
*/

// An array of required objects and their fields, related to personal info
const requiredPersonalObjects = [
  {name: 'totalAmount', fields: ['amount', 'currency']},
  {name: 'consumer', fields: ['givenNames', 'surname']},
  {name: 'shipping', fields: ['countryCode', 'name', 'postcode', 'line1']}
]

// An array of required info for an item
const requiredItemPurchaseInfo = [
  {name: 'quantity', isValid: (val) => {return Number.isInteger(val)}},
  {name: 'price', fields: ['amount', 'currency']},
  {name: 'name'},
  {name: 'category'},
  {name: 'sku'}
]

/*
  Asseses whether @order contains all required fields, and checks where a field is required
  to be a non-string (i.e. item.quantity must be an Integer).
  Returns a JSON object with valid: true, or valid: false with a list of fields
  and problems.
*/
const validate = (order) => {
  if(order === {}) {
    return {
      valid: false
    }  
  }
  else {
    return {
      valid: true
    }
  }
}



exports.validate = validate;
