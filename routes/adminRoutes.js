const express = require("express")
const router = express.Router()
const adminController = require("../Controllers/adminController")
const { authMiddleware, adminMiddleware } = require("../middlewares/auth")

// Approuver un livre (Admin)
router.put("/books/:id/approve", authMiddleware, adminMiddleware, adminController.approveBook)

// Supprimer un avis (Admin)
router.delete("/reviews/:id", authMiddleware, adminMiddleware, adminController.removeReview)

// Gérer les utilisateurs (Admin)
router.get("/users", authMiddleware, adminMiddleware, adminController.manageUsers)

// Changer le rôle d'un utilisateur (Admin)
router.put("/users/:id/role", authMiddleware, adminMiddleware, adminController.changeUserRole)

router.get("/statistics", authMiddleware, adminMiddleware, adminController.getStatistics)

module.exports = router
