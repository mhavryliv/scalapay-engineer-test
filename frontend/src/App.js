import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import UserAndShippingInfo from './UserAndShippingInfo';
import ItemList from './ItemList.js'
// import Item from './Item.js'
import Total from './Total';
import { Button } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';


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
      line1: '',
      postcode: '',
      countryCode: ''
    }
  });
  const [errors, setErrors] = useState({})
  const [itemErrors, setItemErrors] = useState([])
  const [generalError, setGeneralError] = useState('');
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [waitingMessage, setWaitingMessage] = useState('');

  // Catch any change to items, and update the order
  useEffect(() => {
    const updatedOrder = {...order};
    calculateAndAssignTotalAmount(updatedOrder);
    setOrder(updatedOrder);
  }, [items]);

  const parseReturnedErrors = (errors) => {
    const errObj = {}
    const userAndShippingErrors = errors.userAndShipping;
    userAndShippingErrors.forEach(err => {
      errObj[err.field] = [true, err.messages];
    });
    // Create the array of empty item errors (size of the number of current items),
    // then fill in error fields as with order above
    const newItemErrors = [];
    for(let i = 0; i < items.length; ++i) {
      newItemErrors.push({})
    }
    errors.items.forEach(item => {
      const itemIndex = item.itemIndex;
      item.errors.forEach(err => {
        newItemErrors[itemIndex][err.field] = [true, err.messages];
      });
    });
    setErrors(errObj);
    setItemErrors(newItemErrors);
  }
  // Add new item, populate with filler content
  const addItem = () => {
    const newItems = [...items];
    newItems.push({
      name: "Converse Sneakers - Chuck Taylor (Blue)",
      category: "Street shoes",
      sku: "12345678",
      price: {
        amount: 79,
        currency: order.totalAmount.currency,
      },
      quantity: 1
    })
    setItems(newItems);
  }

  const placeOrder = async () => {
    // Clear all errors
    setGeneralError('');
    setErrors({});
    setItemErrors([]);
    const reqOrder = {...order};
    reqOrder.items = items;
    let res;
    setWaitingMessage('Placing order...');
    setIsWaitingForResponse(true);
    try {
      console.log("About to send post req to backend");
      res = await axios.post('http://localhost:8123/order', reqOrder);
      const data = res.data;
      handleOrderPlacement(data);  
    }
    catch(reqErr) {
      console.log("Request error: " + reqErr);
      setGeneralError("Server error when placing order: " + reqErr);
      setIsWaitingForResponse(false);
      return;
    } 
  }

  const handleOrderPlacement = (res) => {
    if(res.valid) {
      // look for the redirect URL
      if(res.checkoutUrl) {
        setWaitingMessage("Directing you to payment site...");
        window.location.href = res.checkoutUrl;
        return;
      }
    }
    else {
      // notify user with errors
      parseReturnedErrors(res.errors);
    }
    setIsWaitingForResponse(false);
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
    setItemErrors([])
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

    // If the totalAmount.currency field was updated, update all the items too
    if(field === "totalAmount.currency") {
      const updatedItems = [...items];
      updatedItems.forEach(item => {
        item.price.currency = value
      })
      setItems(updatedItems);
    }    
  }

  /*
  Calculated the total amount and currency for @order, and updates it in place
  */
  const calculateAndAssignTotalAmount = (order) => {
    let totalPrice = 0;
    for(let i = 0; i < items.length; ++i) {
      totalPrice += parseFloat(items[i].price.amount * items[i].quantity);
    }
    order.totalAmount.amount = totalPrice.toFixed(2);
  }

  return (
    <div className="App">
      <header className="App-header">
        Scalapay Engineering Assessment
      </header>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isWaitingForResponse}
      >
        <div style={{'display': 'flex', 'flexDirection': 'column', 'alignItems': 'center'}}>
        <h4>{waitingMessage}</h4>
        
        <CircularProgress color="inherit" />
        </div>
      </Backdrop>

      <div className="formContainer">
        <UserAndShippingInfo name="Mark" order={order} 
          update={updateFromUserAndShipping} errors={errors}/>
        <ItemList items={items} update={updateFromItems} removeItem={removeItem}
          itemErrors={itemErrors} />
        <Button onClick={addItem}>Add Item</Button>
        {errors.items && items.length === 0 &&
          <div className="error">One or more items required to place order</div>
        }

        <div className="summaryDiv">
          <h4>Summary</h4>
          <Total order={order} update={updateFromUserAndShipping} errors={errors}/>
          <Button onClick={placeOrder}>Place order</Button>
          {generalError.length !== 0 &&
            <div className="error">{generalError}</div>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
