import React, { useState } from 'react';
import './App.css';
import UserInfo from './UserInfo';
import ItemList from './ItemList.js'
// import Item from './Item.js'
import Total from './Total';
import { Button } from '@mui/material';

function App() {
  const [items, setItems] = useState([
    {
      name: "Cons",
      category: "Shoes",
      sku: "feebeeef"
    }
  ])
  const addItem = () => {
    console.log("I've been clicked!")
    const newItems = [...items];
    newItems.push({
      name: "New Item",
      category: "Probably shoes",
      sku: "Feebeef!"
    })
    setItems(newItems);
    console.log.apply(newItems);
  }

  const placeOrder = () => {

  }

  const updateFromItems = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  }

  return (
    <div className="App">
      <header className="App-header">
        Scalapay Engineering Assessment
      </header>
      <div className="body">
        <UserInfo name="Mark" />
        <ItemList items={items} update={updateFromItems}/>
        <Button onClick={addItem}>Add Item</Button>
        <h3>Summary</h3>
        <Total />
        <Button onClick={placeOrder}>Place order</Button>
      </div>


    </div>
  );
}

export default App;
