const Review = require("../models/Review")

const ERROR_MESSAGES = {
  REVIEW_NOT_FOUND: "Avis non trouvé",
  ACCESS_DENIED: "Accès refusé",
  FETCH_ERROR: "Erreur lors de la récupération des avis",
  ADD_ERROR: "Erreur lors de l'ajout de l'avis",
  UPDATE_ERROR: "Erreur lors de la mise à jour",
  DELETE_ERROR: "Erreur lors de la suppression",
}

// Obtenir tous les avis d'un livre
exports.getReviewsByBook = async (req, res) => {
  try {
    const reviews = await Review.find({ bookId: req.params.bookId }).populate("userId", "username")
    res.json({ message: "Avis récupérés", reviews })
  } catch (error) {
    console.error("[v0] Get reviews error:", error)
    res.status(500).json({ message: ERROR_MESSAGES.FETCH_ERROR, error: error.message })
  }
}

// Ajouter un avis
exports.addReview = async (req, res) => {
  try {
    const { bookId, rating, comment } = req.body

    // Validation
    if (!bookId || !rating) {
      return res.status(400).json({ message: "BookId et rating sont requis" })
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "La note doit être entre 1 et 5" })
    }

    const review = new Review({
      userId: req.userId,
      bookId,
      rating,
      comment,
    })

    await review.save()
    res.status(201).json({ message: "Avis ajouté avec succès", review })
  } catch (error) {
    console.error("[v0] Add review error:", error)
    res.status(500).json({ message: ERROR_MESSAGES.ADD_ERROR, error: error.message })
  }
}

// Modifier un avis
exports.editReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)

    if (!review) {
      return res.status(404).json({ message: ERROR_MESSAGES.REVIEW_NOT_FOUND })
    }

    if (review.userId.toString() !== req.userId && req.userRole !== "admin") {
      return res.status(403).json({ message: ERROR_MESSAGES.ACCESS_DENIED })
    }

    const updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json({ message: "Avis mis à jour avec succès", review: updatedReview })
  } catch (error) {
    console.error("[v0] Edit review error:", error)
    res.status(500).json({ message: ERROR_MESSAGES.UPDATE_ERROR, error: error.message })
  }
}

// Supprimer un avis
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)

    if (!review) {
      return res.status(404).json({ message: ERROR_MESSAGES.REVIEW_NOT_FOUND })
    }

    if (review.userId.toString() !== req.userId && req.userRole !== "admin") {
      return res.status(403).json({ message: ERROR_MESSAGES.ACCESS_DENIED })
    }

    await Review.findByIdAndDelete(req.params.id)
    res.json({ message: "Avis supprimé avec succès" })
  } catch (error) {
    console.error("[v0] Delete review error:", error)
    res.status(500).json({ message: ERROR_MESSAGES.DELETE_ERROR, error: error.message })
  }
}
