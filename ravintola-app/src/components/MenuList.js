import React from "react";

import MenuItem from "./MenuItem";
import Card from "./Card";
import classes from './MenuList.module.css'

const MenuList = (props) => {
  return (
    <section className={classes.menulist}>
      <Card>
        <ul>
          {props.menuItems.map((menu) => (
            <MenuItem
              key={menu.id}
              name={menu.name}
              description={menu.description}
              price={menu.price}
              id={menu.id}
              onClick={props.onClick}
            />
          ))}
        </ul>
      </Card>
    </section>
  );
};

export default MenuList;
