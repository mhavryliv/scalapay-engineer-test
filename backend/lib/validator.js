/*
  Validates input before sending to Scalapay endpoint
*/

// Maximum string length for any field, as a default safety check
const MaxStrLen = 50;

const ErrMsgMissingField = "Missing data";
const ErrMsgFieldInvalid = "Invalid data";

// An array of required objects and their fields, related to personal info
const requiredSummaryObjects = [
  {name: 'totalAmount', fields: 
    [{name: 'amount', isValid: (val) => {return val >= 0}}, 
     {name: 'currency', isValid: (code) => {return code.length === 3}}]
  },
  {name: 'consumer', fields: [{name: 'givenNames'}, {name: 'surname'}]},
  {name: 'shipping', fields: 
    [{name: 'countryCode', isValid: (code) => {return code.length === 2}},
    {name: 'name'}, {name: 'postcode'}, {name: 'line1'}]
  }
]

// An array of required info for an item
const requiredItemPurchaseInfo = [
  {name: 'quantity', isValid: (val) => {return Number.isInteger(val) && val >= 0}},
  {name: 'price', fields:
   [{name: 'amount', isValid: (val) => {return val >= 0}}, {name: 'currency'}]
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
  else {
    return val.length <= MaxStrLen;
  }
}

/*
  Asseses whether @order contains all required fields, and checks where a field is required
  to be a non-string (i.e. item.quantity must be an Integer).
  Returns a JSON object with valid: true, or valid: false with a list of fields
  and problems.
*/
const validate = (order) => {
  // Check the toplevel items in the order
  const summaryErrors = checkSummaryInformation(order);

  // Check the individual purchase items
  // const itemErrors = checkPurchaseItemsInformation(order);

  const errors = summaryErrors;

  if(errors.length !== 0) {
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

  // Iterate through all the items in the order, and in an inner loop
  // check each of their fields for validation against the required fields
  items.forEach(item => {
    requiredItemPurchaseInfo.forEach(requiredField => {
      if(!item[requiredField.name]) {

      }
    });
  });


}

/*
Check all the summary order fields (not individual order items) in @order.
Returns an array of errors - if there are no errors, this will be an empty array.
*/
const checkSummaryInformation = (order) => {
  // Keep record of errors
  let errors = objectFieldValidator(order, requiredSummaryObjects);

  return errors;

  // Check for all required field objects
  requiredSummaryObjects.forEach(fieldObj => {
    // Check the order contains an object for this field object
    if(!order[fieldObj.name]) {
      errors.push({field: fieldObj.name, msg: ErrMsgMissingField})
      return;
    }
    const orderObj = order[fieldObj.name];
    // If this field object has no child fields, simply check it's validity and 
    // continue the loop
    if(!fieldObj.fields) {
      if(!isValid(fieldObj, orderObj)) {
        errors.push({field: fieldObj.name, msg: ErrMsgFieldInvalid})
        return;
      }
    }
    // Else, loop through the field's child fields and check their existence and validity
    fieldObj.fields.forEach(childField => {
      const orderChildVal = orderObj[childField.name];
      // If the order doesn't contain the required child field, add and error and continue
      if(!orderChildVal) {
        errors.push({field: fieldObj.name + "." + childField.name, msg: ErrMsgMissingField})
        return;
      }
      // Check the chield field's validity
      if(!isValid(childField, orderChildVal)) {
        errors.push({field: fieldObj.name + "." + childField.name, msg: ErrMsgFieldInvalid})
        return;
      }
    });
  });
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
      errors.push({field: fieldObj.name, msg: ErrMsgMissingField})
      return;
    }
    // Get a convenience reference to the object to validate
    const objectRef = objectToValidate[fieldObj.name];
    // If this field object has no child fields, simply check it's validity and 
    // continue the loop
    if(!fieldObj.fields) {
      if(!isValid(fieldObj, objectRef)) {
        errors.push({field: fieldObj.name, msg: ErrMsgFieldInvalid})
        return;
      }
    }
    // Else, loop through the field's child fields and check their existence and validity
    fieldObj.fields.forEach(childField => {
      const objectRefChildVal = objectRef[childField.name];
      // If the order doesn't contain the required child field, add and error and continue
      if(!objectRefChildVal) {
        errors.push({field: fieldObj.name + "." + childField.name, msg: ErrMsgMissingField})
        return;
      }
      // Check the chield field's validity
      if(!isValid(childField, objectRefChildVal)) {
        errors.push({field: fieldObj.name + "." + childField.name, msg: ErrMsgFieldInvalid})
        return;
      }
    });
  });
  return errors;
}


exports.validate = validate;

// Export these to help build test cases
exports.ErrMsgFieldInvalid = ErrMsgFieldInvalid;
exports.ErrMsgMissingField = ErrMsgMissingField;
exports.requiredSummaryObjects = requiredSummaryObjects;
exports.requiredItemPurchaseInfo = requiredItemPurchaseInfo;