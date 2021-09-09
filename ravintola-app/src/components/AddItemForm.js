import React, { useState } from "react";
import Card from "./Card";
import Button from "./Button";
import classes from './Modal.module.css'
import formclass from './AddItemForm.module.css'

const AddItemForm = (props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState(null);

  const nameChangeHandler = (event) => {
    setName(event.target.value);
  };
  const descriptionChangeHandler = (event) => {
    setDescription(event.target.value);
  };
  const priceChangeHandler = (event) => {
    setPrice(event.target.value);
  };

  const addItemHandler = async (event) => {
    event.preventDefault();
    setError(null);
    if (!name || !description || !price) {
      setError('Values cannot be empty!')
      return
    }
    try {
      const response = await fetch("http://localhost:3001/addItem", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          description: description,
          price: price,
        }),
      });
      if (!response.ok) {
        throw new Error(response.text());
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setName("");
      setDescription("");
      setPrice("");
      props.fetchMenuHandler();
    }
  };

  return (
    <React.Fragment>
      <Card className={formclass.additem}>
        <h2>Add new item to menu</h2>
        <form onSubmit={addItemHandler} className={classes.control}>
          <label htmlFor="name">Item name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={nameChangeHandler}
            onFocus={() => setError(null)}
          />
          <label htmlFor="description">Description</label>
          <input
            id="description"
            type="textfield"
            value={description}
            onChange={descriptionChangeHandler}
            onFocus={() => setError(null)}
          />
          <label htmlFor="price">Price</label>
          <input
            id="price"
            type="number"
            value={price}
            onChange={priceChangeHandler}
            onFocus={() => setError(null)}
          />
          <Button type="submit" className={classes.control}>Add item</Button>
        </form>
        {error && <p>{error}</p>}
      </Card>
    </React.Fragment>
  );
};

export default AddItemForm;
