import React, { useState, useEffect } from "react";

import Header from "./components/Header";
import MenuList from "./components/MenuList";
import LoginModal from "./components/Login";
import AddItemForm from "./components/AddItemForm";
import ItemEditModal from "./components/ItemEditModal";
import Button from "./components/Button";

import "./App.css";

function App() {
  const [menuItems, setMenuItems] = useState([]); // All menu item objects in an array
  const [isLoading, setIsLoading] = useState(false); // Status for loading/not loading data
  const [error, setError] = useState(null); // Error state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false); // State if admin admin is logged in or not
  const [openLogin, setOpenLogin] = useState(false); // State if login modal should be shown or not
  const [openItemEdit, setOpenItemEdit] = useState(false) // State if item editing modal should be shown or not
  const [itemData, setItemData] = useState({}) // Single menu item object

   // Handler to fetch JSON data from backend
  const fetchMenuHandler = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3001/", {
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        // console.log("Error:" + response.text());
        throw new Error(response.text());
      }
      let data = await response.json();

      // Transform mongodb data (basically _id -> id)
      const transformedMenu = data.map((menu) => {
        return {
          id: menu._id,
          name: menu.name,
          description: menu.description,
          price: menu.price,
        };
      });
      setMenuItems(transformedMenu);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };

  // Fetch the data once when the app loads, also check if admin is logged in
  useEffect(() => {
    if (sessionStorage.adminLogin === '1') {
      setIsAdminLoggedIn(true)
    }
    fetchMenuHandler();
  }, [isAdminLoggedIn]);

  // Handle the login button click => Open login modal and on close check if logged in
  const loginClickHandler = () => {
    if (!openLogin) {
      setOpenLogin(true);
    } else {
      if (sessionStorage.adminLogin === '1') {
        setIsAdminLoggedIn(true);
      }
      setOpenLogin(false);
    }
  };

  // Handle the logout button
  const logoutClickHandler = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.adminLogin = '0'
  };

  // Handle menu item editing
  const editMenuItem = (data) => {
    setItemData(data)
    setOpenItemEdit(true)
  }

  // Handle item click when not logged in (normal user)
  const itemClickHandler = () => {
    return
  }

  // Handle modal background or cancel click when editing item
  const itemEditClickHandler = () => {
    (openItemEdit ? setOpenItemEdit(false) : setOpenItemEdit(true)) 
  }

  /// Define content for main section (loading/error/menu)
  let content = <p>Found no menu items.</p>;

  if (menuItems.length > 0) {
    if (!isAdminLoggedIn) {
      content = <MenuList menuItems={menuItems} onClick={itemClickHandler}/>;
    } else {
      content = <MenuList menuItems={menuItems} onClick={editMenuItem} />
    }
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <Header />
      {openLogin && <LoginModal onClick={loginClickHandler} />}
      {openItemEdit && <ItemEditModal onClick={itemEditClickHandler} data={itemData} fetchMenuHandler={fetchMenuHandler} />}
      {isAdminLoggedIn && <AddItemForm fetchMenuHandler={fetchMenuHandler} />}
      <main>{content}</main>
      <footer>
        {!isAdminLoggedIn ? (
          <Button onClick={loginClickHandler}>Login</Button>
        ) : (
          <Button onClick={logoutClickHandler}>Logout</Button>
        )}
      </footer>
    </React.Fragment>
  );
}

export default App;
