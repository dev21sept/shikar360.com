import { Op } from 'sequelize';
import { Scholarship } from '../models/index.js';

export const getScholarships = async (req, res) => {
  try {
    const { search, category, status, isFeatured } = req.query;
    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { provider: { [Op.like]: `%${search}%` } }
      ];
    }
    if (category) where.category = category;
    if (status) where.status = status;
    if (isFeatured !== undefined) where.isFeatured = isFeatured === 'true';

    const scholarships = await Scholarship.findAll({ where, order: [['applicationDeadline', 'ASC']] });
    return res.json({ success: true, count: scholarships.length, scholarships });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch scholarships', error: error.message });
  }
};

export const getScholarshipBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const scholarship = await Scholarship.findOne({ where: { slug } });
    if (!scholarship) {
      return res.status(404).json({ success: false, message: 'Scholarship not found' });
    }
    return res.json({ success: true, scholarship });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch scholarship', error: error.message });
  }
};

export const createScholarship = async (req, res) => {
  try {
    const data = req.body;
    if (!data.slug) {
      data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    const scholarship = await Scholarship.create(data);
    return res.status(201).json({ success: true, scholarship });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create scholarship', error: error.message });
  }
};

export const updateScholarship = async (req, res) => {
  try {
    const { id } = req.params;
    const scholarship = await Scholarship.findByPk(id);
    if (!scholarship) {
      return res.status(404).json({ success: false, message: 'Scholarship not found' });
    }
    await scholarship.update(req.body);
    return res.json({ success: true, scholarship });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update scholarship', error: error.message });
  }
};

export const deleteScholarship = async (req, res) => {
  try {
    const { id } = req.params;
    const scholarship = await Scholarship.findByPk(id);
    if (!scholarship) {
      return res.status(404).json({ success: false, message: 'Scholarship not found' });
    }
    await scholarship.destroy();
    return res.json({ success: true, message: 'Scholarship deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete scholarship', error: error.message });
  }
};
