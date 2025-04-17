const express = require('express');
const router = express.Router();

router.get('/logout', (req, res) => {
    // Détruire complètement la session
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Erreur lors de la déconnexion');
        }
        
        // Rediriger vers une autre page après la déconnexion
        res.redirect('http://localhost:9080/'); // Remplace avec l'URL de redirection souhaitée
    });
});

module.exports = router;
