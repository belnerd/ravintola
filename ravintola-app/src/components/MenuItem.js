import React from 'react';

import classes from './MenuItem.module.css'

const MenuItem = (props) => {
  const price = props.price.toFixed(2) + ' €'
  return (
    <li className={classes.menuitem} onClick={() => props.onClick(props)} id={props.id}>
      <h3>{props.name}</h3>
      <div className={classes.description}>{props.description}</div>
      <div className={classes.price}>{price}</div>
    </li>
  );
};

export default MenuItem;