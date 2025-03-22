const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
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
// Suppression d'une transaction
router.post('/transactions/delete', (req, res) => {
    const { transaction_id } = req.body;
    db.query('DELETE FROM transactions WHERE TransactionID = ?', [transaction_id], (err, results) => {
        if (err) {
            console.error('Erreur suppression:', err);
            res.status(500).send('Erreur serveur');
        } else {
            res.redirect('/transactions');
        }
    });
});

// Modification d'une transaction
router.post('/transactions/update', (req, res) => {
    const { transaction_id, nouveau_montant, nouvelle_date, nouvelle_description } = req.body;
    db.query(
        'UPDATE transactions SET Montant = ?, Date = ?, Description = ? WHERE TransactionID = ?',
        [nouveau_montant, nouvelle_date, nouvelle_description, transaction_id],
        (err, results) => {
            if (err) {
                console.error('Erreur mise à jour:', err);
                res.status(500).send('Erreur serveur');
            } else {
                res.redirect('/transactions');
            }
        }
    );
});

module.exports = router;
