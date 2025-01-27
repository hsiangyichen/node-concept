import express from "express";
const app = express();
const port = 8080;

const ingredients = ["rice", "seaweed", "salmon", "avocado", "wasabi"];

app.get("/famousdish", (req, res) => {
  res.send("Our most famous dish is the Spicy Dragon Roll!");
});

app.get("/ingredients", (req, res) => {
  res.json(ingredients);
});

app.post("/orders", (req, res) => {
  res
    .status(503)
    .send(
      "We are not taking orders at this time. Our service is temporarily down."
    );
});

app.get("/ingredients/:ingredient", (req, res) => {
  const ingredient = req.params.ingredient.toLowerCase();
  if (ingredients.includes(ingredient)) {
    res.send(`The ingredient "${ingredient}" is in stock.`);
  } else {
    res.send(`The ingredient "${ingredient}" is out of stock.`);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
