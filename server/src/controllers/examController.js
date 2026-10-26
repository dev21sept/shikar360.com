import { Op } from 'sequelize';
import { EntranceExam } from '../models/index.js';

export const getExams = async (req, res) => {
  try {
    const { search, stream, level, status, isFeatured } = req.query;
    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { shortName: { [Op.like]: `%${search}%` } },
        { conductingBody: { [Op.like]: `%${search}%` } }
      ];
    }
    if (stream) where.stream = stream;
    if (level) where.level = level;
    if (status) where.status = status;
    if (isFeatured !== undefined) where.isFeatured = isFeatured === 'true';

    const exams = await EntranceExam.findAll({ where, order: [['examDate', 'ASC']] });
    return res.json({ success: true, count: exams.length, exams });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch exams', error: error.message });
  }
};

export const getExamBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const exam = await EntranceExam.findOne({ where: { slug } });
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }
    return res.json({ success: true, exam });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch exam', error: error.message });
  }
};

export const createExam = async (req, res) => {
  try {
    const data = req.body;
    if (!data.slug) {
      data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    const exam = await EntranceExam.create(data);
    return res.status(201).json({ success: true, exam });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create exam', error: error.message });
  }
};

export const updateExam = async (req, res) => {
  try {
    const { id } = req.params;
    const exam = await EntranceExam.findByPk(id);
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }
    await exam.update(req.body);
    return res.json({ success: true, exam });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update exam', error: error.message });
  }
};

export const deleteExam = async (req, res) => {
  try {
    const { id } = req.params;
    const exam = await EntranceExam.findByPk(id);
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }
    await exam.destroy();
    return res.json({ success: true, message: 'Exam deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete exam', error: error.message });
  }
};
