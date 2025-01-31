import express from "express";
const router = express.Router();
import { getPosts } from "../controllers/post-controller.js";

router.get("/", getPosts);

export default router;
