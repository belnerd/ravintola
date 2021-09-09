import React, { useState } from "react";
import ReactDOM from "react-dom";
import Card from "./Card";
import Button from "./Button";
import classes from "./Modal.module.css";

const Backdrop = (props) => {
  return <div className={classes.backdrop} onClick={props.onClick}></div>;
};

// Overlay to display item editing form
const ModalOverlay = (props) => {
  const [itemData, setItemData] = useState(props.data);
  const [error, setError] = useState(null);

  const nameChangeHandler = (event) => {
    const newValue = event.target.value;
    setItemData((prevState) => {
      return { ...prevState, name: newValue };
    });
  };
  const descriptionChangeHandler = (event) => {
    const newValue = event.target.value;
    setItemData((prevState) => {
      return { ...prevState, description: newValue };
    });
  };
  const priceChangeHandler = (event) => {
    const newValue = event.target.value;
    setItemData((prevState) => {
      return { ...prevState, price: newValue };
    });
  };

  const validateForm = () => {
    if (!itemData.name || !itemData.description || !itemData.price) {
      return false;
    } else {
      return true;
    }
  };

  const saveItemHandler = (event) => {
    event.preventDefault();
    if (validateForm()) {
      const con = window.confirm("Save modifications?");
      if (con) {
        saveItem();
      } else {
        return;
      }
    } else {
      setError('Values cannot be empty!')
    }
  };

  const saveItem = async () => {
    setError(null);
    try {
      const response = await fetch("http://localhost:3001/updateItem/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
      });
      if (!response.ok) {
        throw new Error(response.text());
      }
    } catch (error) {
      setError(error.message);
    } finally {
      props.onClick(); // Close modal
      props.fetchMenuHandler(); // Refresh menu
    }
  };

  const deleteItemHandler = (event) => {
    event.preventDefault();
    const con = window.confirm("Delete?");
    if (con) {
      deleteItem();
    } else {
      return;
    }
  };

  const deleteItem = async () => {
    setError(null);
    try {
      const response = await fetch("http://localhost:3001/deleteItem/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
      });
      if (!response.ok) {
        throw new Error(response.text());
      }
    } catch (error) {
      setError(error.message);
    } finally {
      props.onClick(); // Close modal
      props.fetchMenuHandler(); // Refresh menu
    }
  };

  return (
    <Card className={classes.modal}>
      <header className={classes.header}>
        <h2>Edit item</h2>
      </header>
      <div className={classes.content}>
        <form className={classes.control} onSubmit={saveItemHandler}>
          <label htmlFor="name">Item name</label>
          <input
            id="name"
            type="text"
            value={itemData.name}
            onChange={nameChangeHandler}
            onFocus={() => setError(null)}
          />
          <label htmlFor="description">Description</label>
          <input
            id="description"
            type="textarea"
            value={itemData.description}
            onChange={descriptionChangeHandler}
            onFocus={() => setError(null)}
          ></input>
          <label htmlFor="price">Price</label>
          <input
            id="price"
            type="number"
            value={itemData.price}
            onChange={priceChangeHandler}
            onFocus={() => setError(null)}
          />
          {error && <p>{error}</p>}
          <Button
            type="button"
            onClick={deleteItemHandler}
            className={classes.control}
          >
            Delete
          </Button>
          <Button type="submit">Save</Button>
        </form>
      </div>
      <footer className={classes.actions}>
        <Button onClick={props.onClick}>Cancel</Button>
      </footer>
    </Card>
  );
};

// Render backdrop and overlay
const ItemEditModal = (props) => {
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <Backdrop onClick={props.onClick} />,
        document.getElementById("backdrop-root")
      )}
      {ReactDOM.createPortal(
        <ModalOverlay
          onClick={props.onClick}
          data={props.data}
          fetchMenuHandler={props.fetchMenuHandler}
        />,
        document.getElementById("overlay-root")
      )}
    </React.Fragment>
  );
};

export default ItemEditModal;
