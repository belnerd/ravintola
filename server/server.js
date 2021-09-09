const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const port = process.env.PORT;
const mongoose = require("mongoose");

const handleError = (err) => {
  console.log(err);
};

// Connect to the database and bind error reporting
mongoose.connect(process.env.DB_HOST);
let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

//Define a schema
let Schema = mongoose.Schema;

let MenuSchema = new Schema({
  name: String,
  description: String,
  price: Number,
});

// Compile a model based on schema
const MenuModel = mongoose.model("MenuModel", MenuSchema);

// Create an instance of model
// let MenuItem = new MenuModel({
//   name: 'English Breakfast',
//   description: 'Full English breakfast consists of bacon, fried egg, sausage, mushrooms, baked beans, toast, grilled tomatoes, and accompanied with tea or coffee.',
//   price: 12.50
// })

// MenuItem.save(function (err) {
//   if (err) return handleError(err)
// })

// Start listening to port
app.listen(port, () => {
  console.log("Server listening on port " + process.env.PORT);
});

// Allow cross origin resource sharing (without this the returned data is opaque / other actions fail)
let allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  next();
};
app.use(allowCrossDomain);
app.use(express.json());

// Respond with all menu items
app.get("/", (req, res) => {
  console.log('GET')
  MenuModel.find({}, function (err, result) {
    if (err) {
      handleError(err);
    } else {
      res.json(result);
    }
  });
});

// Add new item to mongodb
app.post("/addItem", async (req, res) => {
  console.log("POST")
  const data = req.body;
  const doc = new MenuModel({
    name: data.name,
    description: data.description,
    price: data.price,
  });
  await doc.save(function (err) {
    if (err) {
      handleError(err);
    }
    res.redirect("/");
  });
});

// Delete item from mongodb
app.delete("/deleteItem/", async (req, res) => {
  console.log("DELETE")
  const id = req.body.id;
  await MenuModel.deleteOne({ _id: id }).exec();
  res.send();
});

// Update item in mongodb
app.put("/updateItem/", async (req, res) => {
  console.log("PUT")
  const data = req.body;
  await MenuModel.updateOne(
    { _id: data.id },
    { name: data.name, description: data.description, price: data.price }).exec();
  res.send();
});
