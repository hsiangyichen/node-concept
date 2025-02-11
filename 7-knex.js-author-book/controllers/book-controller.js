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

/* -------------------- Add a new book to the database -------------------- */
async function addBook(req, res) {
  const { title, author_id, published } = req.body;

  // Validate required fields
  if (!title || !author_id || !published) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Validate inputs
  if (
    typeof title !== "string" ||
    title.trim().length < 2 ||
    title.trim().length > 200
  ) {
    return res.status(400).json({
      message: "Book title must be between 2 and 200 characters.",
    });
  }

  if (isNaN(Number(author_id)) || Number(author_id) <= 0) {
    return res.status(400).json({ message: "Invalid author ID." });
  }

  if (
    isNaN(Number(published)) ||
    Number(published) < 0 ||
    Number(published) > new Date().getFullYear()
  ) {
    return res.status(400).json({ message: "Invalid published year." });
  }

  try {
    // Check if the author exists
    const existingAuthor = await db("authors").where({ id: author_id }).first();
    if (!existingAuthor) {
      return res
        .status(404)
        .json({ message: `Could not find author with id: ${author_id}` });
    }

    // Prepare sanitized data
    const bookData = {
      title: title.trim(),
      author_id: Number(author_id),
      published: Number(published),
    };

    // Insert the new book and retrieve its ID
    const [newBookId] = await db("books").insert(bookData);
    const newBook = await db("books")
      .select(["id", "title", "author_id", "published"])
      .where({ id: newBookId })
      .first();

    return res.status(201).json({
      message: "Book added successfully",
      book: newBook,
    });
  } catch (error) {
    console.error("Error adding book:", error);
    return res
      .status(500)
      .json({ message: "Error adding book", error: error.message });
  }
}

/* --------------------- Update an existing book by ID -------------------- */
async function updateBook(req, res) {
  const { id } = req.params;
  const { title, published, author_id } = req.body;

  // Ensure at least one field is provided for update
  if (!title && !published && !author_id) {
    return res
      .status(400)
      .json({ message: "At least one field must be provided for update." });
  }

  // Validate ID (ensure it's a positive integer)
  const bookId = parseInt(id, 10);
  if (isNaN(bookId) || bookId <= 0) {
    return res.status(400).json({ message: "Invalid book ID." });
  }

  // Validate inputs
  if (
    title &&
    (typeof title !== "string" ||
      title.trim().length < 2 ||
      title.trim().length > 150)
  ) {
    return res
      .status(400)
      .json({ message: "Title must be between 2 and 150 characters." });
  }

  if (
    published &&
    (isNaN(Number(published)) ||
      Number(published) < 0 ||
      Number(published) > new Date().getFullYear())
  ) {
    return res.status(400).json({ message: "Invalid publication year." });
  }

  if (author_id && (isNaN(Number(author_id)) || Number(author_id) <= 0)) {
    return res.status(400).json({ message: "Invalid author ID." });
  }

  try {
    // Check if the book exists
    const existingBook = await db("books").where({ id: bookId }).first();
    if (!existingBook) {
      return res
        .status(404)
        .json({ message: `Could not find book with id: ${bookId}` });
    }

    // If author_id is provided, check if the author exists
    if (author_id) {
      const existingAuthor = await db("authors")
        .where({ id: author_id })
        .first();
      if (!existingAuthor) {
        return res
          .status(400)
          .json({ message: `Author with id ${author_id} does not exist.` });
      }
    }

    // Prepare update fields with sanitized data
    const updateFields = {};
    if (title) updateFields.title = title.trim();
    if (published) updateFields.published = Number(published);
    if (author_id) updateFields.author_id = Number(author_id);

    // Check if all fields match the existing values
    if (
      Object.keys(updateFields).every(
        (field) => existingBook[field] === updateFields[field]
      )
    ) {
      return res.status(200).json({
        message:
          "No updates were made as all inputs match the existing values.",
      });
    }

    // Update the book
    await db("books").where({ id: bookId }).update(updateFields);

    const updatedBook = await db("books").where({ id: bookId }).first();

    return res.json({
      message: "Book updated successfully",
      book: updatedBook,
    });
  } catch (error) {
    console.error(`Error updating book with id: ${bookId}:`, error);
    return res.status(500).json({
      message: `Error updating book with id: ${bookId}`,
      error: error.message,
    });
  }
}

/* ------------------------- Delete a book by ID ------------------------- */
async function deleteBook(req, res) {
  const { id } = req.params;

  // Validate ID (ensure it's a positive integer)
  if (!id || isNaN(Number(id)) || Number(id) <= 0) {
    return res.status(400).json({ message: "Invalid book ID." });
  }

  try {
    // Check if the book exists
    const existingBook = await db("books").where({ id }).first();
    if (!existingBook) {
      return res
        .status(404)
        .json({ message: `Could not find book with id: ${id}` });
    }

    // Delete the book
    await db("books").where({ id }).del();

    return res.status(200).json({
      message: "Book deleted successfully",
      deletedBook: existingBook,
    });
  } catch (error) {
    console.error(`Error deleting book with id: ${id}:`, error);
    return res.status(500).json({
      message: `Error deleting book with id: ${id}`,
      error: error.message,
    });
  }
}

export { getAllBooks, getBookById, addBook, updateBook, deleteBook };
