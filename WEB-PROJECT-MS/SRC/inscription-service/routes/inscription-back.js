const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// Configuration de la base de données
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

// Traitement de l'inscription
router.post('/inscription-back', (req, res) => {
    const { nom, prenom, email, mdp, rmdp } = req.body;
    let message = "";

    // Validation des champs
    const nameRegex = /^[a-zA-ZéèêïÉÈÊÏ \-]+$/;
    if (!nameRegex.test(nom)) message += "<div class='err'>Nom invalide!</div>";
    if (!nameRegex.test(prenom)) message += "<div class='err'>Prénom invalide!</div>";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) message += "<div class='err'>Email invalide!</div>";
    if (mdp !== rmdp) message += "<div class='err'>Mots de passe non identiques!</div>";

    if (message === "") {
        // Vérifier si l'e-mail existe déjà
        const checkEmailSql = "SELECT * FROM utilisateurs WHERE Email = ?";
        db.query(checkEmailSql, [email], (err, rows) => {
            if (err) {
                console.error("Erreur lors de la vérification de l'email:", err);
                message = "<div class='err'>Erreur lors du process d'inscription</div>";
                return res.render('inscription', { message });
            }

            if (rows.length > 0) {
                // Email déjà existant
                message = "<div class='err'>Un compte est déjà associé à cette adresse e-mail.</div>";
                return res.render('inscription', { message });
            }

            // Insérer l'utilisateur car l'email est unique
            const dateInscription = new Date().toISOString().split('T')[0];
            const fullName = `${nom} ${prenom}`;
            const motDePasse = require('crypto').createHash('md5').update(mdp).digest('hex');

            const insertSql = "INSERT INTO utilisateurs (Nom, Email, MotDePasse, DateInscription) VALUES (?, ?, ?, ?)";
            db.query(insertSql, [fullName, email, motDePasse, dateInscription], (err, result) => {
                if (err) {
                    console.error('Erreur lors de l\'insertion:', err);
                    message = "<div class='err'>Erreur lors du process d'inscription</div>";
                } else {
                    message = "<div class='ok'>Félicitations, vous êtes maintenant inscrit sur notre site! Vous pouvez vous connecter avec vos identifiants.</div>";
                }
                res.render('inscription', { message });
            });
        });
    } else {
        res.render('inscription', { message });
    }
});

module.exports = router;
