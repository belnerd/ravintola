import React, { useState } from "react";
import ReactDOM from "react-dom";

import Card from "./Card";
import Button from "./Button";
import classes from "./Modal.module.css";

const Backdrop = (props) => {
  return <div className={classes.backdrop} onClick={props.onClick}></div>;
};

const ModalOverlay = (props) => {
  const [login, setLogin] = useState(null);
  const [password, setPassword] = useState(null);
  const [error, setError] = useState(null);

  const loginHandler = (event) => {
    event.preventDefault();
    if (!login || !password) {
      setError("Please enter valid login information!");
      return;
    }
    if (login === "admin" && password === "admin") {
      console.log("Logged in");
      sessionStorage.adminLogin = "1";
      props.onClick();
    } else {
      console.log("Incorrect login");
    }
  };

  const loginChangeHandler = (event) => {
    setLogin(event.target.value);
  };

  const passwordChangeHandler = (event) => {
    setPassword(event.target.value);
  };

  return (
    <Card className={classes.modal}>
      <header className={classes.header}>
        <h2>Login</h2>
      </header>
      <div className={classes.content}>
        <form onSubmit={loginHandler} className={classes.control}>
          <label htmlFor="login">Login</label>
          <input
            id="login"
            type="text"
            onChange={loginChangeHandler}
            onFocus={() => setError(null)}
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            onChange={passwordChangeHandler}
            onFocus={() => setError(null)}
          />
        </form>
        {error && <p>{error}</p>}
      </div>
      <footer className={classes.content}>
        <Button onClick={loginHandler}>Login</Button>
        <Button onClick={props.onClick}>Cancel</Button>
      </footer>
    </Card>
  );
};

const LoginModal = (props) => {
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <Backdrop onClick={props.onClick} />,
        document.getElementById("backdrop-root")
      )}
      {ReactDOM.createPortal(
        <ModalOverlay onClick={props.onClick} />,
        document.getElementById("overlay-root")
      )}
    </React.Fragment>
  );
};

export default LoginModal;
