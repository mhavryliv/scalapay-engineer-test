import React from "react";
import { TextField, Button } from "@mui/material";
import './App.css'
import { MaxStrLen } from './inputConstraints.js'

function Item(props) {
  const handleChange = (event) => {
    props.update(event.target.name, event.target.value);
  };
  const hasErr = (name) => {
    if(props.errors) {
      if(props.errors[name]) {
        return true;
      }
    }
    return false;
  }
  const helperStr = (maxChar = MaxStrLen) => {
    return "Required (" + maxChar + " char max)";
  }
  const helperStrPositiveNum = () => {
    return "Must be greater than 0"
  }

  const itemLayout = (props) => {
    return <div className="item">
      <TextField label="Product Name" variant="standard"  name="productName"
        onChange={handleChange} value={props.item.name}
        inputProps={{maxLength:MaxStrLen}} required
        error={hasErr('name')} 
        helperText={hasErr('name') ? helperStr() : ''}/>

      <TextField label="Category" variant="standard" name="category"
        onChange={handleChange} value={props.item.category}
        inputProps={{maxLength:MaxStrLen}} required
        error={hasErr('category')} 
        helperText={hasErr('category') ? helperStr() : ''}/>

      <TextField label="SKU" variant="standard" name="sku"
        onChange={handleChange} value={props.item.sku}
        inputProps={{maxLength:MaxStrLen}} required
        error={hasErr('sku')} 
        helperText={hasErr('sku') ? helperStr() : ''}/>

      <div className="itemPrice">
        <TextField label="Price" variant="standard" name="price.amount"
          onChange={handleChange} value={props.item.price.amount} type="number"
          required inputProps={{min:"0"}}
          style={{width: '100px'}}
          error={hasErr('price.amount')} 
          helperText={hasErr('price.amount') ? helperStrPositiveNum() : ''}/>

        <TextField label="Currency" variant="standard" name="price.currency"
          value={props.item.price.currency}
          inputProps={{maxLength:3}} InputProps={{readOnly: true}} disabled
          style={{width: '100px'}}
          />

        <TextField label="Quantity" type="number" variant="standard" name="quantity"
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{min:"0"}}
          style={{width: '100px'}}
          onChange={handleChange} value={props.item.quantity} required
          error={hasErr('quantity')} 
          helperText={hasErr('quantity') ? helperStrPositiveNum() : ''}/>

        <Button onClick={props.removeItem} style={{"marginLeft": "auto"}}
        >Remove</Button>
      </div>      
    </div>

  }

  return itemLayout(props);
}



export default Item;