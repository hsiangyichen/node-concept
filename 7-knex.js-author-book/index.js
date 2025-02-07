import "dotenv/config";
import express from "express";
import authorRoutes from "./routes/author-routes.js";
import bookRoutes from "./routes/book-routes.js";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;

// basic home route
app.get("/", (_req, res) => {
  res.send("Welcome to my API");
});

// all authors routes
app.use("/authors", authorRoutes);

// all books routes
app.use("/books", bookRoutes);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
