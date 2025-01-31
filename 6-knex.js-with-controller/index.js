import "dotenv/config";
import express from "express";
import userRoutes from "./routes/user-routes.js";
import postRoutes from "./routes/post-routes.js";

const app = express();

const PORT = process.env.PORT || 5050;

// basic home route
app.get("/", (req, res) => {
  res.send("Welcome to my API");
});

// all users routes
app.use("/users", userRoutes);

// all posts routes
app.use("/posts", postRoutes);

app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});
