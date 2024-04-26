const express = require("express");
const app = express();
const itemsRoutes = require("./routes/items");
const items = require("./fakeDb");

app.use(express.json());

app.use("/items", itemsRoutes);

app.listen(3000, function () {
  console.log("Server is listening on port 3000.");
});

module.exports = app;
