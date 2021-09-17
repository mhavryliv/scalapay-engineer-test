import React from 'react';
import { TextField } from '@mui/material';
import './App.css'

function UserInfo(props)  {
  let ret = userRequiredFields(props);
  return ret;
}

const userRequiredFields = (props) => {
  return (
    <div>
      <h3>Consumer Info</h3>
      <div className="inputForm">
        <TextField id="standard-basic" label="Given Names" variant="standard" />
        <TextField id="standard-basic" label="Surname" variant="standard" />
      </div>
      <h3>Shipping Info</h3>
      <div className="inputForm">
        <TextField id="standard-basic" label="Name" variant="standard" />
        <TextField id="standard-basic" label="Postcode" variant="standard" />
        <TextField id="standard-basic" label="Address" variant="standard" />
      </div>

    </div>
  )
}

export default UserInfo;