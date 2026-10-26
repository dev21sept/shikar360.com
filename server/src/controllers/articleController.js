import { Op } from 'sequelize';
import { Article } from '../models/index.js';

export const getArticles = async (req, res) => {
  try {
    const { search, category } = req.query;
    const where = { status: 'Published' };
    if (search) where.title = { [Op.like]: `%${search}%` };
    if (category) where.category = category;

    const articles = await Article.findAll({ where, order: [['publishedAt', 'DESC']] });
    return res.json({ success: true, count: articles.length, articles });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch articles', error: error.message });
  }
};

export const getArticleBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const article = await Article.findOne({ where: { slug } });
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    return res.json({ success: true, article });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch article', error: error.message });
  }
};

export const createArticle = async (req, res) => {
  try {
    const data = req.body;
    if (!data.slug) {
      data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    if (data.status === 'Published' && !data.publishedAt) {
      data.publishedAt = new Date();
    }
    const article = await Article.create(data);
    return res.status(201).json({ success: true, article });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create article', error: error.message });
  }
};

export const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findByPk(id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    const data = req.body;
    if (data.status === 'Published' && !article.publishedAt) {
      data.publishedAt = new Date();
    }
    await article.update(data);
    return res.json({ success: true, article });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update article', error: error.message });
  }
};

export const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findByPk(id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    await article.destroy();
    return res.json({ success: true, message: 'Article deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete article', error: error.message });
  }
};
