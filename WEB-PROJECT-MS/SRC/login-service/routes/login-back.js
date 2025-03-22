const express = require('express');
const session = require('express-session');
const mysql = require('mysql2');
const crypto = require('crypto');

const app = express();
const router = express.Router();

// Middleware pour parser les données du formulaire
app.use(express.urlencoded({ extended: true }));
const dbConfig = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'smartspenddb'
};
let db;
function connectWithRetry() {
     db = mysql.createConnection(dbConfig);

    db.connect((err) => {
        if (err) {
            console.error('Erreur de connexion, nouvelle tentative dans 5 secondes:', err.message);
            setTimeout(connectWithRetry, 5000);
        } else {
            console.log('Connecté à la base de données');
        }
    });
}

connectWithRetry();

// Traitement de la connexion
router.post('/login-back', (req, res) => {
    const { email, password } = req.body;
    const motDePasse = crypto.createHash('md5').update(password).digest('hex');

    const sql = "SELECT UserID FROM utilisateurs WHERE Email = ? AND MotDePasse = ?";
    db.query(sql, [email, motDePasse], (err, results) => {
        if (err) {
            console.error('Erreur lors de la requête:', err);
            res.render('login', { message: "<div class='err'>Erreur serveur, veuillez réessayer plus tard.</div>" });
        } else if (results.length > 0) {
            // Stocker l'ID utilisateur dans la session
            req.session.user_id = results[0].UserID;
            res.redirect('http://localhost:9083/espace-perso'); // Redirection vers l'espace personnel
        } else {
            res.render('login', { message: "<div class='err'>Mauvais nom d'utilisateur ou mot de passe.</div>" });
        }
    });
});

module.exports = router;
