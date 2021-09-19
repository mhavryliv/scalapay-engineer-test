/*
  Validates input before sending to Scalapay endpoint
*/

// Maximum string length for any field, as a default safety check
const MaxStrLen = 50;

// Error messages
const ErrMsgNoOrder = "MissingOrder";
const ErrMsgNoItems = "NoItems";
const ErrMsgMissingField = "MissingData";
const ErrMsgFieldInvalid = "InvalidData";

// An array of required objects and their fields, related to personal info
const requiredSummaryObjects = [
  {name: 'totalAmount', fields: 
    [{name: 'amount', isValid: (val) => {return val >= 0}, parse: (val) => {return val.toString()}},
     {name: 'currency', isValid: (code) => {return code.toLowerCase() === 'eur'},
      validMessage: "Must be either EUR or eur"}]
  },
  {name: 'consumer', fields: [{name: 'givenNames'}, {name: 'surname'}]},
  {name: 'shipping', fields: 
    [{name: 'countryCode', isValid: (code) => {return code.length === 2}},
    {name: 'name'}, {name: 'postcode', isValid: (pc) => {return pc.length <= 10}},
    {name: 'line1'}]
  }
]

// An array of required info for an item
const requiredItemPurchaseInfo = [
  {name: 'quantity', isValid: (val) => {return val >= 0}, 
    parse: (val) => {return val.toString()}},
  {name: 'price', fields:
   [{name: 'amount', isValid: (val) => {return val >= 0}, 
    parse: (val) => {return val.toString()}},
    {name: 'currency', isValid: (code) => {return code.length === 3}}]
  },
  {name: 'name'},
  {name: 'category'},
  {name: 'sku'}
]

/*
  Checks the validity of a field by testing if it has a built-in isValid function
  and if not, just applying a standard string length test
*/
const isValid = (field, val) => {
  // If the field has a built-in validator function, use that
  if(field.isValid) {
    const res = field.isValid(val);
    return res;
  }
  // otherwise, test for string length and sanitisation
  else {
    if(val.length > MaxStrLen) {
      return false;
    }
    // We should also sanitise the string here, but I don't know 
    // what is the best library for this (and am assuming that Scalapay endpoint
    // is also sanitising...) I would ask a colleague for advice on this.
    return true;
  }
}

/*
  Asseses whether @order contains all required fields, and checks where a field is required
  to be a non-string (i.e. item.quantity must be an Integer).
  Returns a JSON object with valid: true, or valid: false with a list of fields
  and problems.
*/
const validateOrder = (order) => {
  if(!order) {
    return {
      valid: false,
      errors: [{field: 'order', code: ErrMsgNoOrder, messages: ["No order"]}]
    }
  }
  // Check the toplevel items in the order
  const userAndShippingErrors = checkUserAndShippingInformation(order);

  const itemErrors = checkPurchaseItemsInformation(order);

  // If there were no items, add this as an error
  if(!order.items || order.items.length === 0) {
    userAndShippingErrors.push(
      {field: 'items', code: ErrMsgNoItems, messages: ["Order contains no items"]});
  }

  // Build the returned error object
  let errors = {
    userAndShipping: userAndShippingErrors,
    items: itemErrors
  }
  if(errors.userAndShipping.length !== 0 || errors.items.length !== 0) {
    return {
      valid: false,
      errors: errors
    }  
  }
  else {
    return {
      valid: true
    }
  }
}

/*
Check all the individual order items in @order.
Returns an array of errors - if there are no errors, this will be an empty array.
*/
const checkPurchaseItemsInformation = (order) => {
  let errors = [];
  const items = order.items;
  if(!items || items.length === 0) {
    return errors;
  }

  // Store the order currency to compare against the item price.currency fields
  const orderCurrency = order.totalAmount ? order.totalAmount.currency.toLowerCase() : '';

  // Iterate through all the items in the order, and in an inner loop
  // check each of their fields for validation against the required fields
  for(let i = 0; i < items.length; ++i) {
    // Do the general object field validator
    let itemErrors = objectFieldValidator(items[i], requiredItemPurchaseInfo);
    // Check the item price currency matches the order totalAmount.currency
    if(items[i].price &&
       items[i].price.currency.toLowerCase() !== orderCurrency) {
         itemErrors.push({field: 'price.currency', code: ErrMsgFieldInvalid, 
         messages: ['Item price currency must match the order total amount currency']})
       }
    // If there are errors, add it to the error list with this item's index
    if(itemErrors.length !== 0) {
      errors.push({itemIndex: i, errors: itemErrors});
    }
  }
  return errors;
}

/*
Check all the summary order fields (not individual order items) in @order.
Returns an array of errors - if there are no errors, this will be an empty array.
*/
const checkUserAndShippingInformation = (order) => {
  // Keep record of errors
  let errors = objectFieldValidator(order, requiredSummaryObjects);
  return errors;
}

/*
  This is a generalised function to check the fields in @objToCheck against
  those in @requiredFields, both for existence and validity.
  Return an array of errors, empty array if none.
*/
const objectFieldValidator = (objectToValidate, requiredFields) => {
  // Keep record of errors
  let errors = [];
  // Check for all required field objects
  requiredFields.forEach(fieldObj => {
    // Check the object contains a value for this field object
    if(!objectToValidate[fieldObj.name]) {
      errors.push({field: fieldObj.name, code: ErrMsgMissingField, messages: ["Required"]})
      return;
    }
    // Get a convenience reference to the object to validate
    const objectRef = objectToValidate[fieldObj.name];
    // If this field object has no child fields, simply check it's validity and 
    // continue the loop
    if(!fieldObj.fields) {
      if(!isValid(fieldObj, objectRef)) {
        let messages = ["Invalid"];
        if(fieldObj.validMessage) {
          messages = [fieldObj.validMessage];
        }
        errors.push({field: fieldObj.name, code: ErrMsgFieldInvalid, messages: messages})
      }
      // Make sure it's parsed properly
      else {
        if(fieldObj.parse) {
          objectToValidate[fieldObj.name] = fieldObj.parse(objectToValidate[fieldObj.name]);
        }
      }
      return;
    }
    // Else, loop through the field's child fields and check their existence and validity
    fieldObj.fields.forEach(childField => {
      const objectRefChildVal = objectRef[childField.name];
      // If the order doesn't contain the required child field, add and error and continue
      if(!objectRefChildVal) {
        errors.push({field: fieldObj.name + "." + childField.name,
         code: ErrMsgMissingField, messages: ["Required"]})
        return;
      }
      // Check the chield field's validity
      if(!isValid(childField, objectRefChildVal)) {
        let messages = ["Invalid"];
        if(childField.validMessage) {
          messages = [childField.validMessage];
        }
        errors.push({field: fieldObj.name + "." + childField.name, 
        code: ErrMsgFieldInvalid, messages: messages})
        return;
      }
      // Make sure it's parsed properly
      else {
        if(childField.parse) {
          objectRef[childField.name] = childField.parse(objectRefChildVal);
        }
      }
    });
  });
  return errors;
}

export {validateOrder, 
  ErrMsgFieldInvalid, ErrMsgMissingField, ErrMsgNoItems, ErrMsgNoOrder};
