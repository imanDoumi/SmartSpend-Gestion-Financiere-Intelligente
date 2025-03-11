const express = require('express');
router = express.Router();
const mysql = require('mysql2');
// Configuration de la base de données
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'smartspenddb'
});

db.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données:', err);
    } else {
        console.log('Connecté à la base de données');
    }
});
// Traitement de l'inscription
router.post('/inscription-back', (req, res) => {
    console.log(req.body);
    const { nom, prenom, email, mdp, rmdp } = req.body;
    let message = "";

    // Validation des champs
    const nameRegex = /^[a-zA-ZéèêïÉÈÊÏ \-]+$/;
    if (!nameRegex.test(nom)) message += "<div class='err'>Nom invalide!</div>";
    if (!nameRegex.test(prenom)) message += "<div class='err'>Prénom invalide!</div>";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) message += "<div class='err'>Email invalide!</div>";
    if (mdp !== rmdp) message += "<div class='err'>Mots de passe non identiques!</div>";

    if (message === "") {
        const dateInscription = new Date().toISOString().split('T')[0];
        const fullName = `${nom} ${prenom}`;
        const motDePasse = require('crypto').createHash('md5').update(mdp).digest('hex');

        const sql = "INSERT INTO utilisateurs (Nom, Email, MotDePasse, DateInscription) VALUES (?, ?, ?, ?)";
        db.query(sql, [fullName, email, motDePasse, dateInscription], (err, result) => {
            if (err) {
                console.error('Erreur lors de l\'insertion:', err);
                message = "<div class='err'>Erreur lors du process d'inscription</div>";
            } else {
                message = "<div class='ok'>Félicitations, vous êtes maintenant inscrit sur notre site! Vous pouvez vous connecter avec vos identifiants.</div>";
            }
            res.render('inscription', { message });
        });
    } else {
        res.render('inscription', { message });
    }
});
module.exports=router;