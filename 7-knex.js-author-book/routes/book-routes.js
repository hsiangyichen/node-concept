import express from "express";
import {
  getAllBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
} from "../controllers/book-controller.js";
const router = express.Router();

router.route("/").get(getAllBooks).post(addBook);

router.route("/:id").get(getBookById).put(updateBook).delete(deleteBook);

export default router;
