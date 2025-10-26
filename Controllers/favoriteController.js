const Favorite = require("../models/Favorite")

const ERROR_MESSAGES = {
  FAVORITE_NOT_FOUND: "Favori non trouvé",
  ALREADY_FAVORITE: "Ce livre est déjà en favori",
  FETCH_ERROR: "Erreur lors de la récupération des favoris",
  ADD_ERROR: "Erreur lors de l'ajout du favori",
  DELETE_ERROR: "Erreur lors de la suppression",
}

// Obtenir les favoris de l'utilisateur
exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.userId }).populate("bookId")
    res.json({ message: "Favoris récupérés", favorites })
  } catch (error) {
    console.error("[v0] Get favorites error:", error)
    res.status(500).json({ message: ERROR_MESSAGES.FETCH_ERROR, error: error.message })
  }
}

// Ajouter un favori
exports.addFavorite = async (req, res) => {
  try {
    const { bookId } = req.body

    if (!bookId) {
      return res.status(400).json({ message: "BookId est requis" })
    }

    const favoriteExists = await Favorite.findOne({ userId: req.userId, bookId })
    if (favoriteExists) {
      return res.status(400).json({ message: ERROR_MESSAGES.ALREADY_FAVORITE })
    }

    const favorite = new Favorite({
      userId: req.userId,
      bookId,
    })

    await favorite.save()
    res.status(201).json({ message: "Favori ajouté avec succès", favorite })
  } catch (error) {
    console.error("[v0] Add favorite error:", error)
    res.status(500).json({ message: ERROR_MESSAGES.ADD_ERROR, error: error.message })
  }
}

// Supprimer un favori
exports.deleteFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOneAndDelete({
      userId: req.userId,
      bookId: req.params.bookId,
    })

    if (!favorite) {
      return res.status(404).json({ message: ERROR_MESSAGES.FAVORITE_NOT_FOUND })
    }

    res.json({ message: "Favori supprimé avec succès" })
  } catch (error) {
    console.error("[v0] Delete favorite error:", error)
    res.status(500).json({ message: ERROR_MESSAGES.DELETE_ERROR, error: error.message })
  }
}
