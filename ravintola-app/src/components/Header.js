import React from 'react' 
import classes from "./Header.module.css";

import perunat from '../assets/perunat.png'

const Header = (props) => {
  return (
    <React.Fragment>
      <header className={classes.header}>
          <h1>Restauranté</h1>
      </header>
      <div className={classes['main-image']}>
          <img src={perunat} alt="Potatoes" />
      </div>
    </React.Fragment>
  );
};

export default Header;
