const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const moment = require('moment');


// Connexion MySQL sans promesses
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
router.get('/transactions', (req, res) => {
    // Vérifie si la session contient un user_id
    if (!req.session || !req.session.user_id) {
        return res.redirect('http://localhost:9080/'); // Redirige vers la page d'accueil si l'utilisateur n'est pas connecté
    }

    const userID = req.session.user_id;

    // Requête SQL avec un callback
    db.query('SELECT * FROM transactions WHERE UserID = ?', [userID], (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des transactions:', err);
            return res.status(500).send('Erreur serveur');
        }
        results.forEach(transaction => {
            transaction.Date = moment(transaction.Date).format('YYYY-MM-DD');
        });

        res.render('transactions', { transactions: results });
    });
});

module.exports = router;
