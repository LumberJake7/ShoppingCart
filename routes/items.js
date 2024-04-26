const express = require("express");
const router = express.Router();
const items = require("../fakeDb");

router.get("/", function (req, res) {
  res.json(items);
});

router.post("/", function (req, res) {
  const newItem = { name: req.body.name, price: req.body.price };
  items.push(newItem);
  res.status(201).json({ added: newItem });
});

router.get("/:name", function (req, res) {
  const item = items.find((i) => i.name === req.params.name);
  if (!item) return res.status(404).json({ error: "Item not found" });
  res.json(item);
});

router.patch("/:name", function (req, res) {
  const item = items.find((i) => i.name === req.params.name);
  if (!item) return res.status(404).json({ error: "Item not found" });
  if (req.body.name) item.name = req.body.name;
  if (req.body.price) item.price = req.body.price;
  res.json({ updated: item });
});

router.delete("/:name", function (req, res) {
  const itemIndex = items.findIndex((i) => i.name === req.params.name);
  if (itemIndex === -1) {
    return res.status(404).json({ error: "Item not found" });
  }

  items.splice(itemIndex, 1);
  res.json({ message: `Deleted: ${req.params.name}` });
});

module.exports = router;
