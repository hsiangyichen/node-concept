import express from "express";
import foodRoutes from "./routes/foodRoutes.js";

const app = express();
const port = 8080;

/* --------------------------- Application Config --------------------------- */
app.use(express.static("public"));
app.use("/photos", express.static("public/images"));

/* ------------------------------- Middleware ------------------------------- */
app.use((req, res, next) => {
  console.log(`Request Path: ${req.originalUrl}, Time: ${Date.now()}`);
  next();
});

// bonus
// app.use("/foods/soups", (req, res, next) => {
//   console.log(`Request Path: ${req.originalUrl}, Time: ${Date.now()}`);
//   next();
// });

/* -------------------------------- Routes ------------------------------- */
app.get("/", (req, res) => {
  res.send("Welcome to the server!");
});

app.use("/foods", foodRoutes);

/* ---------------------------- Start the Server ---------------------------- */
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
