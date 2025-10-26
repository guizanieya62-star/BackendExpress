//const Book = require("../models/Book")
//const Review = require("../models/Review")
const User = require("../models/userSchema")

// Approuver un livre
exports.approveBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, { approved: true }, { new: true })
    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" })
    }
    res.json({ message: "Livre approuvé", book })
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'approbation", error })
  }
}

// Supprimer un avis
exports.removeReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id)
    if (!review) {
      return res.status(404).json({ message: "Avis non trouvé" })
    }
    res.json({ message: "Avis supprimé par l'admin" })
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression", error })
  }
}

// Gérer les utilisateurs - Lister tous les utilisateurs
exports.manageUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password")
    res.json({ message: "Liste des utilisateurs", users })
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs", error })
  }
}

// Changer le rôle d'un utilisateur
exports.changeUserRole = async (req, res) => {
  try {
    const { role } = req.body
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password")
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" })
    }
    res.json({ message: "Rôle mis à jour", user })
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du rôle", error })
  }
}

// Obtenir les statistiques du site
exports.getStatistics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalBooks = await Book.countDocuments()
    const totalReviews = await Review.countDocuments()

    res.json({
      message: "Statistiques du site",
      statistics: {
        totalUsers,
        totalBooks,
        totalReviews,
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des statistiques", error })
  }
}
