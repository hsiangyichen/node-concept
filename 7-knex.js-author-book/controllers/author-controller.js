import db from "../db.js";

/* -------------------- Get all authors from the database ------------------- */

async function getAllAuthors(_req, res) {
  try {
    const data = await db("authors");
    return res.json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error getting all authors", error: error.message });
  }
}

/* ------------------------ Get a single author by ID ----------------------- */

async function getAuthorById(req, res) {
  const { id } = req.params;

  // Validate ID (ensure it's a positive integer)
  if (!id || isNaN(Number(id)) || Number(id) <= 0) {
    return res.status(400).json({ message: "Invalid author ID." });
  }

  try {
    // Check if the author exists
    const existingAuthor = await db("authors").where({ id }).first();
    if (!existingAuthor) {
      return res
        .status(404)
        .json({ message: `Could not find author with id: ${id}` });
    }
    return res.json(author);
  } catch (error) {
    console.error(`Error getting author with id ${id}:`, error);
    return res.status(500).json({
      message: `Error getting author with id: ${id}`,
      error: error.message,
    });
  }
}

/* -------------------- Add a new author to the database -------------------- */

async function addAuthor(req, res) {
  const { author } = req.body;

  // Validate input: ensure author name is a non-empty string
  if (!author || typeof author !== "string" || author.trim().length === 0) {
    return res
      .status(400)
      .json({ message: "Author name is required and cannot be empty" });
  }

  try {
    // Insert the new author and retrieve its ID
    const [newAuthorId] = await db("authors").insert({ author });

    return res.status(201).json({ id: newAuthorId, author });
  } catch (error) {
    console.error("Error posting author:", error);
    return res
      .status(500)
      .json({ message: "Error posting author", error: error.message });
  }
}

/* --------------------- Update an existing author by ID -------------------- */

async function updateAuthor(req, res) {
  const { id } = req.params;
  const { author } = req.body;

  // Validate ID (ensure it's a positive integer)
  if (!id || isNaN(Number(id)) || Number(id) <= 0) {
    return res.status(400).json({ message: "Invalid author ID." });
  }

  // Validate input: ensure author name is a non-empty string
  if (!author || typeof author !== "string" || author.trim().length === 0) {
    return res
      .status(400)
      .json({ message: "Author name is required and cannot be empty" });
  }

  try {
    // Check if the author exists
    const existingAuthor = await db("authors").where({ id }).first();
    if (!existingAuthor) {
      return res
        .status(404)
        .json({ message: `Could not find author with id: ${id}` });
    }

    // Check if the new author name is the same as the existing one
    if (existingAuthor.author.trim() === author.trim()) {
      return res.status(200).json({
        message:
          "No updates were made as all inputs match the existing values.",
      });
    }

    // Update the author
    await db("authors").where({ id }).update({ author });

    return res.json({ message: "Author updated successfully" });
  } catch (error) {
    console.error(`Error updating author with id: ${id}:`, error);
    return res.status(500).json({
      message: `Error updating author with id: ${id}`,
      error: error.message,
    });
  }
}

/* ------------------------- Delete an author by ID ------------------------- */
async function deleteAuthor(req, res) {
  const { id } = req.params;

  // Validate ID (ensure it's a positive integer)
  if (!id || isNaN(Number(id)) || Number(id) <= 0) {
    return res.status(400).json({ message: "Invalid author ID." });
  }

  try {
    // Check if the author exists
    const existingAuthor = await db("authors").where({ id }).first();
    if (!existingAuthor) {
      return res
        .status(404)
        .json({ message: `Could not find author with id: ${id}` });
    }

    // Delete the author
    await db("authors").where({ id }).del();

    return res.status(200).json({ message: "Author deleted successfully", id });
  } catch (error) {
    console.error(`Error deleting author with id: ${id}:`, error);
    return res.status(500).json({
      message: `Error deleting author with id: ${id}`,
      error: error.message,
    });
  }
}

/* ----------------------- Get all books by author ID ----------------------- */
async function getBooksByAuthorId(req, res) {
  const { id } = req.params;

  // Validate ID (ensure it's a positive integer)
  if (!id || isNaN(Number(id)) || Number(id) <= 0) {
    return res.status(400).json({ message: "Invalid author ID." });
  }

  try {
    // Check if author exists
    const existingAuthor = await db("authors").where({ id }).first();
    if (!existingAuthor) {
      return res
        .status(404)
        .json({ message: `Could not find author with id: ${id}` });
    }

    /*
    // Fetch books by the author using JOIN
    // SELECT books.id, books.title, books.published, authors.author
    // FROM books
    // JOIN authors ON books.author_id = authors.id
    // WHERE authors.id = ?;
    */

    const books = await db("books")
      .join("authors", "books.author_id", "authors.id")
      .select("books.id", "books.title", "books.published", "authors.author")
      .where("authors.id", id);

    return res.json({ books });
  } catch (error) {
    console.error(`Error getting books for author with id: ${id}`, error);
    return res.status(500).json({
      message: `Error getting books for author with id: ${id}`,
      error: error.message,
    });
  }
}

export {
  getAllAuthors,
  addAuthor,
  getAuthorById,
  updateAuthor,
  deleteAuthor,
  getBooksByAuthorId,
};
