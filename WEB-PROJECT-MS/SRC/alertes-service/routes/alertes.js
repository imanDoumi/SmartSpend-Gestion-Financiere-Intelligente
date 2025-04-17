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
const months = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

router.get('/alertes', (req, res) => {
    if (!req.session.user_id) {
        return res.redirect('http://localhost:9080/');
    }

    res.render('alertes', { message: '' });  // Juste un rendu de la page sans données
});
router.get('/api/alertes-data', (req, res) => {
    const userID = req.session.user_id;
    const currentMonthYear = new Date().toISOString().slice(0, 7) + '-01';

    let alerts = [];
    let budgetData = { BudgetMensuel: 0, MontantAEconomiser: 0 };
    let spendingData = { TotalSpent: 0 };
    let monthlySpendingData = Array(12).fill(0);
    let monthlyBudgetData = Array(12).fill(0);

    // Récupérer le budget du mois en cours
    const sql_budget = "SELECT BudgetMensuel, MontantAEconomiser FROM budgets WHERE UtilisateurID = ? AND MoisAnnee = ?";
    
    db.query(sql_budget, [userID, currentMonthYear], (err, budgetResult) => {
        if (err) {
            console.error('Erreur lors de la récupération des paramètres', err);
            return res.status(500).json({ message: 'Erreur lors du chargement des paramètres' });
        }

        if (budgetResult.length > 0) {
            budgetData = {
                BudgetMensuel: parseFloat(budgetResult[0].BudgetMensuel) || 0,
                MontantAEconomiser: parseFloat(budgetResult[0].MontantAEconomiser) || 0
            };
        } else {
            alerts.push("Aucun budget ou montant à économiser n'a été défini pour ce mois.");
        }

        console.log("Budget du mois : ", budgetData);

        // Récupérer les dépenses du mois en cours
        const sql_spending = "SELECT IFNULL(SUM(Montant), 0) AS TotalSpent FROM transactions WHERE UserID = ? AND MONTH(Date) = MONTH(?) AND YEAR(Date) = YEAR(?)";

        db.query(sql_spending, [userID, currentMonthYear, currentMonthYear], (err, spendingResult) => {
            if (err) {
                console.error('Erreur lors de la récupération des dépenses', err);
                return res.status(500).json({ message: 'Erreur lors du chargement des dépenses' });
            }

            spendingData = {
                TotalSpent: parseFloat(spendingResult[0].TotalSpent) || 0
            };

            const economieReelle = budgetData.BudgetMensuel - spendingData.TotalSpent;
            const remainingBudget = budgetData.BudgetMensuel - spendingData.TotalSpent - budgetData.MontantAEconomiser;

            console.log("Dépenses du mois : ", spendingData);
            console.log("Économie réelle : ", economieReelle);
            console.log("Budget restant : ", remainingBudget);

            if (remainingBudget < 0.1 * budgetData.BudgetMensuel) {
                alerts.push("Attention! Il reste moins de 10% de votre budget total.");
            }
            if (spendingData.TotalSpent > budgetData.BudgetMensuel) {
                alerts.push("Vous avez dépassé votre budget mensuel!");
            }

            // Récupérer les données historiques pour les 12 derniers mois
            let monthPromises = [];
            let monthsList = [];

            for (let i = 11; i >= 0; i--) {
                let dateObj = new Date();
                dateObj.setMonth(dateObj.getMonth() - i);
                let month = dateObj.toISOString().slice(0, 7) + '-01';
                monthsList.push(months[dateObj.getMonth()] + " " + dateObj.getFullYear());

                // Promesse pour les dépenses mensuelles
                let spendingPromise = new Promise((resolve, reject) => {
                    db.query("SELECT IFNULL(SUM(Montant), 0) AS TotalSpent FROM transactions WHERE UserID = ? AND MONTH(Date) = MONTH(?) AND YEAR(Date) = YEAR(?)",
                        [userID, month, month], (err, resSpending) => {
                            if (err) return reject(err);
                            monthlySpendingData[11 - i] = parseFloat(resSpending[0].TotalSpent) || 0;
                            resolve();
                        });
                });

                // Promesse pour le budget mensuel
                let budgetPromise = new Promise((resolve, reject) => {
                    db.query("SELECT BudgetMensuel FROM budgets WHERE UtilisateurID = ? AND MoisAnnee = ?",
                        [userID, month], (err, resBudget) => {
                            if (err) return reject(err);
                            monthlyBudgetData[11 - i] = resBudget.length > 0 ? parseFloat(resBudget[0].BudgetMensuel) || 0 : 0;
                            resolve();
                        });
                });

                monthPromises.push(spendingPromise, budgetPromise);
            }

            // Attendre toutes les promesses avant de répondre
            Promise.all(monthPromises)
                .then(() => {
                    console.log("Données mensuelles de dépenses : ", monthlySpendingData);
                    console.log("Données mensuelles de budget : ", monthlyBudgetData);

                    return res.json({
                        alerts: alerts,
                        budgetData: budgetData,
                        spendingData: spendingData,
                        economieReelle: economieReelle,
                        monthlySpendingData: monthlySpendingData,
                        monthlyBudgetData: monthlyBudgetData,
                        months: monthsList
                    });
                })
                .catch((err) => {
                    console.error('Erreur lors du traitement des données mensuelles', err);
                    res.status(500).json({ message: 'Erreur lors de la récupération des données mensuelles' });
                });
        });
    });
});

module.exports = router;
