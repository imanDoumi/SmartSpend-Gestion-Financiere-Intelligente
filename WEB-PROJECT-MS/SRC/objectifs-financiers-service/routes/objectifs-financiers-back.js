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

router.post('/set-budget', (req, res) => {
    const userID = req.session.user_id;
    const moisAnnee = req.body.mois_annee + '-01'; 
    const budgetMensuel = req.body.budget_mensuel;
    const montantAEconomiser = req.body.montant_a_economiser;

    const sql = "SELECT ID FROM budgets WHERE UtilisateurID = ? AND MoisAnnee = ?";
    db.query(sql, [userID, moisAnnee], (err, result) => {
        if (err) {
            console.error('Erreur lors de la récupération des paramètres', err);
            return res.redirect('/objectifs-financiers?message=Erreur de mise à jour');
        }

        if (result.length > 0) {
            const id = result[0].ID;
            const sql_update = "UPDATE budgets SET BudgetMensuel = ?, MontantAEconomiser = ? WHERE ID = ?";
            db.query(sql_update, [budgetMensuel, montantAEconomiser, id], (err, result) => {
                if (err) {
                    console.error('Erreur lors de la mise à jour', err);
                    return res.redirect('/objectifs-financiers?message=Erreur de mise à jour');
                }
                res.redirect('/objectifs-financiers?message=Budget et montant mis à jour');
            });
        } else {
            const sql_insert = "INSERT INTO budgets (UtilisateurID, MoisAnnee, BudgetMensuel, MontantAEconomiser) VALUES (?, ?, ?, ?)";
            db.query(sql_insert, [userID, moisAnnee, budgetMensuel, montantAEconomiser], (err, result) => {
                if (err) {
                    console.error('Erreur lors de l\'insertion', err);
                    return res.redirect('/objectifs-financiers?message=Erreur lors de la définition du budget');
                }
                res.redirect('/objectifs-financiers?message=Budget et montant définis');
            });
        }
    });
});
module.exports = router;
