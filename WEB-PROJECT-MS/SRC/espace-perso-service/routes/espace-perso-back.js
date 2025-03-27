const express = require('express');
const mysql = require('mysql2');

const app = express();
const router = express.Router();

// Middleware pour traiter les données des formulaires
app.use(express.urlencoded({ extended: true }));



// Connexion à la base de données
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


// Route pour ajouter une transaction
router.post('/espace-perso-back',(req, res) => {
    const { categorie, montant, date, description } = req.body;
    const userID = req.session.user_id;

    if (!categorie || !montant || !date || !description) {
        const message = "<div class='erreur'>Tous les champs sont requis.</div>";
        return res.render('ajout_transaction', { message });
    }

    const sql = `INSERT INTO transactions (UserID, CategorieID, Montant, Date, Description)
                 VALUES (?, ?, ?, ?, ?)`;

    db.query(sql, [userID, categorie, montant, date, description], (err, result) => {
        let message = '';
        if (err) {
            console.error('Erreur lors de l\'insertion de la transaction:', err);
            message = "<div class='erreur'>Erreur lors de l'insertion de la transaction : " + err.message + "</div>";
        } else {
            message = "<div class='succes'>La transaction a été ajoutée avec succès.</div>";
        }
        res.render('espace-perso', { message });
    });
});
module.exports = router;