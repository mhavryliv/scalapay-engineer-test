import React from 'react';
import Item from './Item.js';

function ItemList (props) {
  
  const itemUpdated = (i, field, value) => {
    props.update(i, field, value);
  }

  const removeItem = (i) => {
    props.removeItem(i);
  }

  if(props.items.length === 0) {
    return false
  }
  return <div>
    <h4>Items</h4>
    {props.items.map((item, i) => {
      return <Item item={item} key={i} 
        update={(name, value) => {itemUpdated(i, name, value)}}
        removeItem={() => removeItem(i)} 
        errors={props.itemErrors[i]}/>
    })}
  </div>
}


export default ItemList;