import express from "express";
import { getAllBooks, getBookById } from "../controllers/book-controller.js";
const router = express.Router();

router.route("/").get(getAllBooks);

router.route("/:id").get(getBookById);

export default router;
