import express from "express";
const router = express.Router();

// A GET route at /soups that returns an array of strings that are soup names
router.get("/soups", (req, res) => {
  res.json(["ramen", "corn soup", "chicken noodle soup"]);
});

// A GET route at /salads that returns an array of strings that are the names of salads
router.get("/salads", (req, res) => {
  res.json(["ceaser salad", "green salad", "fruit salad"]);
});

export default router;
