const express = require("express");
router = express.Router();
router.get("/espace-perso", (req, res) => {
    // Vérifie si la session contient un user_id
    if (req.session && req.session.user_id) {
        // Si la session existe (utilisateur connecté), affiche la page espace-perso
        res.render("espace-perso", { user_id: req.session.user_id });
    } else {
        // Si pas de session (utilisateur non connecté), redirige vers la page de login
        res.redirect("http://localhost:9080/");
    }
});

module.exports = router;
