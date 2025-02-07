import db from "../db.js";

/* -------------------- Get all books from the database ------------------- */

async function getAllBooks(_req, res) {
  try {
    const data = await db("books");
    return res.json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error getting all books", error: error.message });
  }
}

/* ------------------------ Get a single book by ID ----------------------- */

async function getBookById(req, res) {
  const { id } = req.params;

  // Validate ID (ensure it's a positive integer)
  if (!id || isNaN(Number(id)) || Number(id) <= 0) {
    return res.status(400).json({ message: "Invalid book ID." });
  }

  try {
    const book = await db("books")
      .join("authors", "books.author_id", "authors.id")
      .select(
        "books.id",
        "books.title",
        "books.published",
        "authors.author",
        "authors.birthYear",
        "authors.nationality"
      )
      .where("books.id", id)
      .first();

    if (!book) {
      return res
        .status(404)
        .json({ message: `Could not find book with id: ${id}` });
    }
    return res.json(book);
  } catch (error) {
    console.error(`Error getting book with id ${id}:`, error);
    return res.status(500).json({
      message: `Error getting book with id: ${id}`,
      error: error.message,
    });
  }
}

export { getAllBooks, getBookById };
