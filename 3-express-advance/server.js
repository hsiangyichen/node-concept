import express from "express";
import foodRoutes from "./routes/foodRoutes.js";

const app = express();
app.use(express.static("public"));

const port = 8080;

app.get("/", (req, res) => {
  res.send("Welcome to the server!");
});

// middleware
app.use((req, res, next) => {
  console.log(`Request Path: ${req.originalUrl}, Time: ${Date.now()}`);
  next();
});

// bonus
// app.use("/foods/soups", (req, res, next) => {
//   console.log(`Request Path: ${req.originalUrl}, Time: ${Date.now()}`);
//   next();
// });

// endpoints
app.use("/foods", foodRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
