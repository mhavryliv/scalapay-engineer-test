import React from 'react';
import { TextField } from '@mui/material';
import './App.css'
import { MaxStrLen } from './inputConstraints.js'

function UserAndShippingInfo(props)  {
  const handleChange = (event) => {
    props.update(event.target.name, event.target.value);
  };
  
  const userRequiredFields = (props) => {
    return (
      <div className="userAndShippingInfoDiv">
        <h4>Shopper Info</h4>
        <div className="inputForm">
          <TextField label="Given Names" variant="standard" name="consumer.givenNames"
            onChange={handleChange} value={props.order.consumer.givenNames}
            inputProps={{maxLength:MaxStrLen}} required/>
          <TextField label="Surname" variant="standard" name="consumer.surname"
            onChange={handleChange} value={props.order.consumer.surname}
            inputProps={{maxLength:MaxStrLen}} required/>
        </div>
        <h4>Shipping Info</h4>
        <div className="inputForm">
          <TextField label="Name" variant="standard" name="shipping.name" 
            onChange={handleChange} value={props.order.shipping.name}
            inputProps={{maxLength:MaxStrLen}} required/>
          <TextField label="Postcode" variant="standard" name="shipping.postcode"
            onChange={handleChange} value={props.order.shipping.postcode}
            inputProps={{maxLength:MaxStrLen}} required/>
          <TextField label="Address" variant="standard" name="shipping.countryCode"
            onChange={handleChange} value={props.order.shipping.countryCode}
            inputProps={{maxLength:MaxStrLen}} required/>
        </div>
      </div>
    )
  }

  return userRequiredFields(props);
}



export default UserAndShippingInfo;