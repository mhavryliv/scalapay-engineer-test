import React from "react";
import { TextField } from "@mui/material";

function Total(props) {
  const hasErr = (name) => {
    if(props.errors) {
      if(props.errors[name]) {
        return true;
      }
    }
    return false;
  }
  
  const errString = (name) => {
    if(props.errors) {
      if(props.errors[name]) {
        return props.errors[name][1][0]
      }
    }
    return ''
  }

  const handleChange = (event) => {
    props.update(event.target.name, event.target.value);
  };

  return <div className="totalDiv">
    <div>{props.order.totalAmount.amount}</div>
    {/* <div>&nbsp;{props.order.totalAmount.currency}</div> */}
    <TextField label="Currency" variant="standard" name="totalAmount.currency"
          onChange={handleChange} value={props.order.totalAmount.currency}
          inputProps={{maxLength:3}} required
          style={{'marginLeft': '20px', 'width': '150px'}}
          error={hasErr('totalAmount.currency')} 
          helperText={hasErr('totalAmount.currency') ? errString('totalAmount.currency') : ''}/>
  </div>

}

export default Total;