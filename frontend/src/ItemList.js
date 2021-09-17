import React from 'react';
import Item from './Item.js';

function ItemList (props) {
  
  const itemUpdated = (i, field, value) => {
    props.update(i, field, value);
  }

  return <div>
    <h3>Items</h3>
    {props.items.map((item, i) => {
      return <Item vals={item} key={i} 
        update={(name, value) => {itemUpdated(i, name, value)}}/>
    })}
  </div>
}


export default ItemList;