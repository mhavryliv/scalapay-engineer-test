import React from "react";

function Total(props) {
  return <div className="totalDiv">
    <div>Total Amount: {props.totalAmount}</div>
    <div>Currency: {props.currency}</div>
  </div>

}

export default Total;