const User = require("../models/userSchema")
const jwt = require("jsonwebtoken")

// Messages d'erreur constants
const ERROR_MESSAGES = {
  USER_EXISTS: "Utilisateur ou email déjà existant",
  INVALID_CREDENTIALS: "Identifiants invalides",
  USER_NOT_FOUND: "Utilisateur non trouvé",
  REGISTRATION_ERROR: "Erreur lors de l'enregistrement",
  LOGIN_ERROR: "Erreur lors de la connexion",
  UPDATE_ERROR: "Erreur lors de la mise à jour",
  DELETE_ERROR: "Erreur lors de la suppression",
}

// Enregistrement
module.exports.register = async (req, res) => {
  try {
    const { username, password, email } = req.body

    // Validation
    if (!username || !password || !email) {
      return res.status(400).json({ message: "Tous les champs sont requis" })
    }

    const userExists = await User.findOne({ $or: [{ username }, { email }] })
    if (userExists) {
      return res.status(400).json({ message: ERROR_MESSAGES.USER_EXISTS })
    }

    const user = new User({ username, password, email })
    await user.save()

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    })
  } catch (error) {
    console.error("[v0] Registration error:", error)
    res.status(500).json({ message: ERROR_MESSAGES.REGISTRATION_ERROR, error: error.message })
  }
}

// Connexion
module.exports.login = async (req, res) => {
  try {
    const { username, password } = req.body

    // Validation
    if (!username || !password) {
      return res.status(400).json({ message: "Nom d'utilisateur et mot de passe requis" })
    }

    const user = await User.findOne({ username })
    if (!user) {
      return res.status(401).json({ message: ERROR_MESSAGES.INVALID_CREDENTIALS })
    }

    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: ERROR_MESSAGES.INVALID_CREDENTIALS })
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.json({
      message: "Connexion réussie",
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    res.status(500).json({ message: ERROR_MESSAGES.LOGIN_ERROR, error: error.message })
  }
}

// Mettre à jour le profil
module.exports.updateProfile = async (req, res) => {
  try {
    const { email, username } = req.body

    // Validation
    if (!email && !username) {
      return res.status(400).json({ message: "Au moins un champ doit être fourni" })
    }

    const user = await User.findByIdAndUpdate(req.userId, { email, username }, { new: true }).select("-password")

    res.json({ message: "Profil mis à jour avec succès", user })
  } catch (error) {
    console.error("[v0] Update profile error:", error)
    res.status(500).json({ message: ERROR_MESSAGES.UPDATE_ERROR, error: error.message })
  }
}

// Supprimer le compte
module.exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.userId)
    res.json({ message: "Compte supprimé avec succès" })
  } catch (error) {
    console.error("[v0] Delete account error:", error)
    res.status(500).json({ message: ERROR_MESSAGES.DELETE_ERROR, error: error.message })
  }
}
