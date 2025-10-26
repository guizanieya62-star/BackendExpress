const Book = require("../models/Book")

const ERROR_MESSAGES = {
  BOOK_NOT_FOUND: "Livre non trouvé",
  FETCH_ERROR: "Erreur lors de la récupération des livres",
  ADD_ERROR: "Erreur lors de l'ajout du livre",
  UPDATE_ERROR: "Erreur lors de la mise à jour",
  DELETE_ERROR: "Erreur lors de la suppression",
}

// Obtenir tous les livres
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find()
    res.json({ message: "Livres récupérés", books })
  } catch (error) {
    console.error("[v0] Get all books error:", error)
    res.status(500).json({ message: ERROR_MESSAGES.FETCH_ERROR, error: error.message })
  }
}

// Obtenir les détails d'un livre
exports.getBookDetails = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    if (!book) {
      return res.status(404).json({ message: ERROR_MESSAGES.BOOK_NOT_FOUND })
    }
    res.json({ message: "Livre récupéré", book })
  } catch (error) {
    console.error("[v0] Get book details error:", error)
    res.status(500).json({ message: ERROR_MESSAGES.FETCH_ERROR, error: error.message })
  }
}

// Ajouter un livre (Admin)
exports.addBook = async (req, res) => {
  try {
    const { title, author, genre, description, publicationDate, coverImage, content } = req.body

    // Validation
    if (!title || !author || !genre) {
      return res.status(400).json({ message: "Titre, auteur et genre sont requis" })
    }

    const book = new Book({
      title,
      author,
      genre,
      description,
      publicationDate,
      coverImage,
      content,
    })

    await book.save()
    res.status(201).json({ message: "Livre ajouté avec succès", book })
  } catch (error) {
    console.error("[v0] Add book error:", error)
    res.status(500).json({ message: ERROR_MESSAGES.ADD_ERROR, error: error.message })
  }
}

// Mettre à jour un livre (Admin)
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!book) {
      return res.status(404).json({ message: ERROR_MESSAGES.BOOK_NOT_FOUND })
    }
    res.json({ message: "Livre mis à jour avec succès", book })
  } catch (error) {
    console.error("[v0] Update book error:", error)
    res.status(500).json({ message: ERROR_MESSAGES.UPDATE_ERROR, error: error.message })
  }
}

// Supprimer un livre (Admin)
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id)
    if (!book) {
      return res.status(404).json({ message: ERROR_MESSAGES.BOOK_NOT_FOUND })
    }
    res.json({ message: "Livre supprimé avec succès" })
  } catch (error) {
    console.error("[v0] Delete book error:", error)
    res.status(500).json({ message: ERROR_MESSAGES.DELETE_ERROR, error: error.message })
  }
}
