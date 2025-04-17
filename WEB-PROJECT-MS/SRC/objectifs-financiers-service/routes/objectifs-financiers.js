const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
// Configurer la connexion à la base de données
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
router.get('/objectifs-financiers', (req, res) => {
    if (!req.session.user_id) {
        // Si la session n'existe pas, rediriger l'utilisateur vers la page d'accueil
        return res.redirect('http://localhost:9080/');
    }
    const userID = req.session.user_id;
    const currentMonthYeardb = new Date().toISOString().slice(0, 7) + '-01';
    const currentMonthYear = new Date().toISOString().slice(0, 7)

    const sql_current = "SELECT BudgetMensuel, MontantAEconomiser FROM budgets WHERE UtilisateurID = ? AND MoisAnnee = ?";
    db.query(sql_current, [userID, currentMonthYeardb], (err, result) => {
        if (err) {
            console.error('Erreur lors de la récupération des paramètres', err);
            return res.render('objectifs-financiers', { message: 'Erreur lors du chargement des paramètres.' });
        }

        const current_settings = result[0] || {};
        console.log(current_settings);
        res.render('objectifs-financiers', {
            current_settings: current_settings,
            currentMonthYear: currentMonthYear,
            message: req.query.message || '' // Afficher un message si présent
        });
    });
});

module.exports = router;
