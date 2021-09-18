import React from "react";
import { TextField, Button } from "@mui/material";
import './App.css'
import { MaxStrLen } from './inputConstraints.js'

function Item(props) {
  const handleChange = (event) => {
    props.update(event.target.name, event.target.value);
  };

  const itemLayout = (props) => {
    return <div className="item">
      <TextField label="Product Name" variant="standard"  name="productName"
        onChange={handleChange} value={props.item.name}
        inputProps={{maxLength:MaxStrLen}} required/>

      <TextField label="Category" variant="standard" name="category"
        onChange={handleChange} value={props.item.category}
        inputProps={{maxLength:MaxStrLen}} required/>

      <TextField label="SKU" variant="standard" name="sku"
        onChange={handleChange} value={props.item.sku}
        inputProps={{maxLength:MaxStrLen}} required/>

      <div className="itemPrice">
        <TextField label="Price" variant="standard" name="price.amount"
          onChange={handleChange} value={props.item.price.amount} type="number"
          style={{flexGrow:1}} required inputProps={{min:"0"}}/>

        <TextField label="Currency" variant="standard" name="price.currency"
          onChange={handleChange} value={props.item.price.currency}
          inputProps={{maxLength:3}} required/>

        <TextField label="Quantity" type="number" variant="standard" name="quantity"
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{min:"0"}}
          onChange={handleChange} value={props.item.quantity} required/>
          
        <Button onClick={props.removeItem}>Remove</Button>
      </div>      
    </div>

  }

  return itemLayout(props);
}



export default Item;