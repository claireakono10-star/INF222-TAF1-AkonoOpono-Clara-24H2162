// controllers/articleController.js
// Le contrôleur contient la logique métier : validation, réponses HTTP, appel au modèle.
// Il fait le lien entre les routes (entrées HTTP) et le modèle (base de données).

const ArticleModel = require('../models/articleModel');

const ArticleController = {

  // GET /api/articles
  getAll(req, res) {
    try {
      const { categorie, auteur, date } = req.query;
      const articles = ArticleModel.getAll({ categorie, auteur, date });

      // On parse les tags (stockés en JSON string) pour chaque article
      const parsed = articles.map(a => ({ ...a, tags: JSON.parse(a.tags) }));
      res.status(200).json({ articles: parsed });
    } catch (err) {
      res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
  },

  // GET /api/articles/:id
  getById(req, res) {
    try {
      const article = ArticleModel.getById(req.params.id);
      if (!article) {
        return res.status(404).json({ error: 'Article non trouvé' });
      }
      res.status(200).json({ ...article, tags: JSON.parse(article.tags) });
    } catch (err) {
      res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
  },

  // GET /api/articles/search?query=texte
  search(req, res) {
    try {
      const { query } = req.query;
      if (!query || query.trim() === '') {
        return res.status(400).json({ error: 'Le paramètre query est requis' });
      }
      const articles = ArticleModel.search(query);
      const parsed = articles.map(a => ({ ...a, tags: JSON.parse(a.tags) }));
      res.status(200).json({ articles: parsed });
    } catch (err) {
      res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
  },

  // POST /api/articles
  create(req, res) {
    try {
      const { titre, contenu, auteur, date, categorie, tags } = req.body;

      // Validation des champs obligatoires
      if (!titre || titre.trim() === '') {
        return res.status(400).json({ error: 'Le titre est obligatoire' });
      }
      if (!auteur || auteur.trim() === '') {
        return res.status(400).json({ error: "L'auteur est obligatoire" });
      }
      if (!contenu || contenu.trim() === '') {
        return res.status(400).json({ error: 'Le contenu est obligatoire' });
      }
      if (!categorie || categorie.trim() === '') {
        return res.status(400).json({ error: 'La catégorie est obligatoire' });
      }

      const id = ArticleModel.create({ titre, contenu, auteur, date, categorie, tags });
      res.status(201).json({ message: 'Article créé avec succès', id });
    } catch (err) {
      res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
  },

  // PUT /api/articles/:id
  update(req, res) {
    try {
      const article = ArticleModel.update(req.params.id, req.body);
      if (!article) {
        return res.status(404).json({ error: 'Article non trouvé' });
      }
      res.status(200).json({
        message: 'Article mis à jour avec succès',
        article: { ...article, tags: JSON.parse(article.tags) }
      });
    } catch (err) {
      res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
  },

  // DELETE /api/articles/:id
  delete(req, res) {
    try {
      const deleted = ArticleModel.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Article non trouvé' });
      }
      res.status(200).json({ message: 'Article supprimé avec succès' });
    } catch (err) {
      res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
  }
};

module.exports = ArticleController;
