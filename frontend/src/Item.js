import React, { useState } from "react";
import { TextField } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import './App.css'

function Item(props) {
  const handleChange = (event) => {
    props.update(event.target.name, event.target.value);
  };

  const handleInputChanged = (event) => {

  }

  const itemLayout = (props) => {
    return <div className="item">
      <TextField label="Name" variant="standard"  name="name"
      onChange={handleChange} value={props.vals.name}/>
      <TextField label="Category" variant="standard" name="category"
      onChange={handleChange} value={props.vals.category}/>
      <TextField label="SKU" variant="standard" name="sku"
      onChange={handleChange} value={props.vals.sku}/>
      <div className="itemPrice">
        <TextField label="Price" variant="standard" 
        style={{flexGrow:1}}/>
        <TextField label="Currency" variant="standard" />
        <TextField
          label="Quantity"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          variant="standard"
        />
      </div>

      
    </div>

  }

  let ret = itemLayout(props);
  return ret;

}



export default Item;