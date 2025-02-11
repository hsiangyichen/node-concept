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
    return res.json(existingAuthor);
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
  const { author, birthYear, nationality } = req.body;

  // Validate required fields
  if (!author || !birthYear || !nationality) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Validate inputs
  if (
    author &&
    (typeof author !== "string" ||
      author.trim().length < 2 ||
      author.trim().length > 100)
  ) {
    return res
      .status(400)
      .json({ message: "Author name must be between 2 and 100 characters." });
  }

  if (
    birthYear &&
    (isNaN(Number(birthYear)) ||
      Number(birthYear) < 0 ||
      Number(birthYear) > new Date().getFullYear())
  ) {
    return res.status(400).json({ message: "Invalid birth year." });
  }

  if (
    nationality &&
    (typeof nationality !== "string" ||
      nationality.trim().length < 2 ||
      nationality.trim().length > 50)
  ) {
    return res
      .status(400)
      .json({ message: "Nationality must be between 2 and 50 characters." });
  }

  try {
    // Prepare sanitized data
    const authorData = {
      author: author.trim(),
      birthYear: Number(birthYear),
      nationality: nationality.trim(),
    };

    // Insert the new author and retrieve its ID
    const [newAuthorId] = await db("authors").insert(authorData);
    const newAuthor = await db("authors")
      .select(["id", "author", "birthYear", "nationality"])
      .where({ id: newAuthorId })
      .first();

    // return res.status(201).json(newAuthor);
    return res.status(201).json({
      message: "Author created successfully",
      author: newAuthor,
    });
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
  const { author, birthYear, nationality } = req.body;

  // Ensure at least one field is provided for update
  if (!author && !birthYear && !nationality) {
    return res
      .status(400)
      .json({ message: "At least one field must be provided for update." });
  }

  // Validate ID (ensure it's a positive integer)
  if (!id || isNaN(Number(id)) || Number(id) <= 0) {
    return res.status(400).json({ message: "Invalid author ID." });
  }

  // Validate inputs
  if (
    author &&
    (typeof author !== "string" ||
      author.trim().length < 2 ||
      author.trim().length > 100)
  ) {
    return res
      .status(400)
      .json({ message: "Author name must be between 2 and 100 characters." });
  }

  if (
    birthYear &&
    (isNaN(Number(birthYear)) ||
      Number(birthYear) < 0 ||
      Number(birthYear) > new Date().getFullYear())
  ) {
    return res.status(400).json({ message: "Invalid birth year." });
  }

  if (
    nationality &&
    (typeof nationality !== "string" ||
      nationality.trim().length < 2 ||
      nationality.trim().length > 50)
  ) {
    return res
      .status(400)
      .json({ message: "Nationality must be between 2 and 50 characters." });
  }

  try {
    // Check if the author exists
    const existingAuthor = await db("authors").where({ id }).first();
    if (!existingAuthor) {
      return res
        .status(404)
        .json({ message: `Could not find author with id: ${id}` });
    }

    // Prepare update fields with sanitized data
    const updateFields = {};
    if (author) updateFields.author = author.trim();
    if (birthYear) updateFields.birthYear = Number(birthYear);
    if (nationality) updateFields.nationality = nationality.trim();

    // Check if all fields match the existing values
    if (
      Object.keys(updateFields).every(
        (field) => existingAuthor[field] === updateFields[field]
      )
    ) {
      return res.status(200).json({
        message:
          "No updates were made as all inputs match the existing values.",
      });
    }

    // Update the author
    await db("authors").where({ id }).update(updateFields);

    const updatedAuthor = await db("authors").where({ id }).first();

    // return res.status(201).json(updatedAuthor);
    return res.json({
      message: "Author updated successfully",
      author: updatedAuthor,
    });
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

    // Check if the author has associated books
    const books = await db("books").where({ author_id: id });
    if (books.length > 0) {
      return res.status(400).json({
        message: `Cannot delete author with id: ${id} because they have associated books.`,
        associatedBooks: books,
      });
    }

    // Delete the author
    await db("authors").where({ id }).del();

    return res
      .status(200)
      .json({
        message: "Author deleted successfully",
        deletedAuthor: existingAuthor,
      });
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
