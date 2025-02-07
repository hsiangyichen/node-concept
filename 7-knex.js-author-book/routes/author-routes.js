import express from "express";
import {
  getAllAuthors,
  addAuthor,
  getAuthorById,
  updateAuthor,
  deleteAuthor,
  getBooksByAuthorId,
} from "../controllers/author-controller.js";
const router = express.Router();

// Shorter way to write router.get("/", getAllAuthors) and router.post("/", addNewAuthor)
router.route("/").get(getAllAuthors).post(addAuthor);

// Shorter way to write router.get("/:id", getAuthorById), router.put("/:id", updateAuthor), and router.delete("/:id", deleteAuthor);
router.route("/:id").get(getAuthorById).put(updateAuthor).delete(deleteAuthor);

router.route("/:id/books").get(getBooksByAuthorId);

export default router;
