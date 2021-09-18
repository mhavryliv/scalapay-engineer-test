import React from "react";

function Total(props) {
  return <div className="totalDiv">
    <div>{props.order.totalAmount.amount}</div>
    <div>&nbsp;{props.order.totalAmount.currency}</div>
  </div>

}

export default Total;