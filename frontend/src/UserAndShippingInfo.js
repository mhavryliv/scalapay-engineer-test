import React from 'react';
import { TextField } from '@mui/material';
import './App.css'
import { MaxStrLen } from './inputConstraints.js'

function UserAndShippingInfo(props)  {
  const handleChange = (event) => {
    props.update(event.target.name, event.target.value);
  };

  const hasErr = (name) => {
    return props.errors[name];
  }
  const helperStr = (maxChar = MaxStrLen) => {
    return "Required (" + maxChar + " char max)";
  }
  
  const userRequiredFields = (props) => {
    return (
      <div className="userAndShippingInfoDiv">
        <h4>Shopper Info</h4>
        <div className="inputForm">
          <TextField label="Given Names" variant="standard" name="consumer.givenNames"
            onChange={handleChange} value={props.order.consumer.givenNames}
            inputProps={{maxLength:MaxStrLen}} required
            error={hasErr('consumer.givenNames')} 
            helperText={hasErr('consumer.givenNames') ? helperStr() : ''}/>

          <TextField label="Surname" variant="standard" name="consumer.surname"
            onChange={handleChange} value={props.order.consumer.surname}
            inputProps={{maxLength:MaxStrLen}} required
            error={hasErr('consumer.surname')} 
            helperText={hasErr('consumer.surname') ? helperStr() : ''}/>
        </div>

        <h4>Shipping Info</h4>
        <div className="inputForm">
          <TextField label="Name" variant="standard" name="shipping.name" 
            onChange={handleChange} value={props.order.shipping.name}
            inputProps={{maxLength:MaxStrLen}} required
            error={hasErr('shipping.name')} 
            helperText={hasErr('shipping.name') ? helperStr() : ''}/>

          <TextField label="Address" variant="standard" name="shipping.line1"
            onChange={handleChange} value={props.order.shipping.line1}
            inputProps={{maxLength:MaxStrLen}} required
            error={hasErr('shipping.line1')} 
            helperText={hasErr('shipping.line1') ? helperStr() : ''}/>

          <TextField label="Postcode" variant="standard" name="shipping.postcode"
            onChange={handleChange} value={props.order.shipping.postcode}
            inputProps={{maxLength:10}} required
            error={hasErr('shipping.postcode')} 
            helperText={hasErr('shipping.postcode') ? helperStr(10) : ''}/>

          <TextField label="Country Code" variant="standard" name="shipping.countryCode"
            onChange={handleChange} value={props.order.shipping.countryCode}
            inputProps={{maxLength:2}} required
            error={hasErr('shipping.countryCode')} 
            helperText={hasErr('shipping.countryCode') ? helperStr(2) : ''}/>

        </div>
      </div>
    )
  }

  return userRequiredFields(props);
}



export default UserAndShippingInfo;