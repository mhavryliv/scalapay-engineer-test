import React from "react";
import { TextField } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import './App.css'

function Item(props) {
  const [currency, setCurrency] = React.useState('EUR');
  const handleChange = (event) => {
    setCurrency(event.target.value);
  };

  const itemLayout = (props) => {
    return <div className="item">
      <TextField label="Name" variant="standard" />
      <TextField label="Category" variant="standard" />
      <div className="itemPrice">
        <TextField label="Price" variant="standard" 
        style={{flexGrow:1}}/>
        <TextField label="Currency" variant="standard" />
      </div>
      
    </div>

  }

  let ret = itemLayout(props);
  return ret;

}



export default Item;