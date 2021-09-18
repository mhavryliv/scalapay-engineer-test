import React, { useState } from 'react';
import './App.css';
import UserAndShippingInfo from './UserAndShippingInfo';
import ItemList from './ItemList.js'
// import Item from './Item.js'
import Total from './Total';
import { Button } from '@mui/material';

function App() {
  const [items, setItems] = useState([])
  const [order, setOrder] = useState({
    totalAmount: {
      amount: 0,
      currency: 'EUR'
    },
    consumer: {
      givenNames: '',
      surname: ''
    },
    shipping: {
      name: '',
      postcode: '',
      countryCode: ''
    }
  });
  const [errors, setErrors] = useState({

  })
  // Add new item, populate with filler content
  const addItem = () => {
    const newItems = [...items];
    newItems.push({
      name: "Converse Sneakers - Chuck Taylor (Blue)",
      category: "Street shoes",
      sku: "12345678",
      price: {
        amount: 79,
        currency: "EUR",
      },
      quantity: 1
    })
    setItems(newItems);
  }

  const placeOrder = () => {
    computeOrder();
  }

  const updateFromItems = (index, field, value) => {
    const updatedItems = [...items];
    // handle the productName exception (TextField is named "name" to help browser autcomplete)
    if(field === "productName") {
      field = "name";
    }
    // Handle sub-property like item.price.currency
    if(field.indexOf(".") !== -1) {
      const propArray = field.split('.');
      updatedItems[index][propArray[0]][propArray[1]] = value;
    }
    else {
      updatedItems[index][field] = value;
    }
    setItems(updatedItems);
  }
  
  const removeItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  }

  const updateFromUserAndShipping = (field, value) => {
    const updatedOrder = {...order};
    // Handle sub-property like consumer.givenNames
    if(field.indexOf(".") !== -1) {
      const propArray = field.split('.');
      updatedOrder[propArray[0]][propArray[1]] = value;
    }
    else {
      updatedOrder[field] = value;
    }
    setOrder(updatedOrder);
  }

  const computeOrder = () => {
    let totalPrice = 0;
    // Use the first currency code as default, and if none, then 
    let orderCurrency = order.totalAmount.currency;
    if(items.length > 0) {
      console.log(items[0])
      orderCurrency = items[0].price.currency;
    }
    for(let i = 0; i < items.length; ++i) {
      totalPrice += parseFloat(items[i].price.amount);
    }
    const updatedOrder = {...order};
    updatedOrder.totalAmount.amount = totalPrice.toFixed(2);
    updatedOrder.totalAmount.currency = orderCurrency;
    console.log(updatedOrder);
    setOrder(updatedOrder);
  }

  return (
    <div className="App">
      <header className="App-header">
        Scalapay Engineering Assessment
      </header>
      <div className="formContainer">
        <UserAndShippingInfo name="Mark" order={order} update={updateFromUserAndShipping}/>
        <ItemList items={items} update={updateFromItems} removeItem={removeItem}/>

        <Button onClick={addItem}>Add Item</Button>
        <div className="summaryDiv">
          <h4>Summary</h4>
          <Total order={order}/>
          <Button onClick={placeOrder}>Place order</Button>
        </div>
      </div>


    </div>
  );
}

export default App;
