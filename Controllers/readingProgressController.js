const ReadingProgress = require("../models/ReadingProgress")

const ERROR_MESSAGES = {
  PROGRESS_NOT_FOUND: "Progression non trouvée",
  FETCH_ERROR: "Erreur lors de la récupération de la progression",
  UPDATE_ERROR: "Erreur lors de la mise à jour",
}

// Obtenir la progression de lecture
exports.getProgress = async (req, res) => {
  try {
    const progress = await ReadingProgress.findOne({
      userId: req.userId,
      bookId: req.params.bookId,
    })

    if (!progress) {
      return res.status(404).json({ message: ERROR_MESSAGES.PROGRESS_NOT_FOUND })
    }

    res.json({ message: "Progression récupérée", progress })
  } catch (error) {
    console.error("[v0] Get progress error:", error)
    res.status(500).json({ message: ERROR_MESSAGES.FETCH_ERROR, error: error.message })
  }
}

// Mettre à jour la progression de lecture
exports.updateProgress = async (req, res) => {
  try {
    const { currentPage } = req.body

    if (currentPage === undefined) {
      return res.status(400).json({ message: "currentPage est requis" })
    }

    let progress = await ReadingProgress.findOne({
      userId: req.userId,
      bookId: req.params.bookId,
    })

    if (!progress) {
      progress = new ReadingProgress({
        userId: req.userId,
        bookId: req.params.bookId,
        currentPage,
      })
    } else {
      progress.currentPage = currentPage
      progress.lastAccessed = new Date()
    }

    await progress.save()
    res.json({ message: "Progression mise à jour avec succès", progress })
  } catch (error) {
    console.error("[v0] Update progress error:", error)
    res.status(500).json({ message: ERROR_MESSAGES.UPDATE_ERROR, error: error.message })
  }
}
