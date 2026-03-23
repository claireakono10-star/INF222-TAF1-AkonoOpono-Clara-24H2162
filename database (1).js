// config/database.js
// Ce fichier initialise la base de données SQLite et crée la table articles si elle n'existe pas.

const Database = require('better-sqlite3');
const path = require('path');

// Le fichier blog.db sera créé automatiquement à la racine du projet
const db = new Database(path.join(__dirname, '..', 'blog.db'));

// Activation des clés étrangères (bonne pratique SQLite)
db.pragma('journal_mode = WAL');

// Création de la table articles si elle n'existe pas encore
db.exec(`
  CREATE TABLE IF NOT EXISTS articles (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    titre     TEXT    NOT NULL,
    contenu   TEXT    NOT NULL,
    auteur    TEXT    NOT NULL,
    date      TEXT    NOT NULL DEFAULT (date('now')),
    categorie TEXT    NOT NULL,
    tags      TEXT    NOT NULL DEFAULT '[]'
  )
`);

module.exports = db;
