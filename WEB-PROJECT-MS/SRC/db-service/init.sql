-- Création de la base de données
CREATE DATABASE IF NOT EXISTS smartspenddb;

-- Sélection de la base de données pour l'utilisation
USE smartspenddb;

-- Création de la table 'Utilisateurs'
CREATE TABLE IF NOT EXISTS utilisateurs (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Nom VARCHAR(255),
    Email VARCHAR(255) UNIQUE,
    MotDePasse VARCHAR(255),
    DateInscription DATE
);

-- Création de la table 'Categories'
CREATE TABLE IF NOT EXISTS categories (
    CategorieID INT AUTO_INCREMENT PRIMARY KEY,
    Nom VARCHAR(255) UNIQUE
);

-- Création de la table 'Transactions'
CREATE TABLE IF NOT EXISTS transactions (
    TransactionID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    CategorieID INT,
    Montant DECIMAL(10, 2),
    Date DATE,
    Description TEXT,
    FOREIGN KEY (UserID) REFERENCES utilisateurs(UserID),
    FOREIGN KEY (CategorieID) REFERENCES categories(CategorieID)
);

-- Création de la table 'ObjectifsFinanciers'
CREATE TABLE IF NOT EXISTS objectifsfinanciers (
    ObjectifID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    Nom VARCHAR(255),
    MontantCible DECIMAL(10, 2),
    DateCible DATE,
    Progression DECIMAL(10, 2),
    FOREIGN KEY (UserID) REFERENCES utilisateurs(UserID)
);

-- Création de la table 'Alertes'
CREATE TABLE IF NOT EXISTS alertes (
    AlerteID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    Message TEXT,
    DateHeure DATETIME,
    FOREIGN KEY (UserID) REFERENCES utilisateurs(UserID)
);

-- Insertion des catégories par défaut dans la table 'Categories'
INSERT INTO categories (Nom) VALUES
('Nourriture'),
('Logement'),
('Transport'),
('Loisirs'),
('Santé'),
('Éducation'),
('Factures'),
('Vêtements'),
('Épargne'),
('Divertissement'),
('Voyage'),
('Assurance'),
('Impôts'),
('Remboursements de dettes'),
('Autres');

-- Création de la table 'budgets'
CREATE TABLE IF NOT EXISTS budgets (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    UtilisateurID INT NOT NULL,
    MoisAnnee DATE NOT NULL,
    BudgetMensuel DECIMAL(10, 2) NOT NULL,
    MontantAEconomiser DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (UtilisateurID) REFERENCES utilisateurs(UserID)
);