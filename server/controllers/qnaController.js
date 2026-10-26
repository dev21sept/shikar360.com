import { Op } from 'sequelize';
import { Question, Answer, User } from '../models/index.js';

export const getQuestions = async (req, res) => {
  try {
    const { search, tag } = req.query;
    const where = { status: 'Published' };
    if (search) where.title = { [Op.like]: `%${search}%` };
    if (tag) where.tags = { [Op.like]: `%${tag}%` };

    const questions = await Question.findAll({
      where,
      include: [
        { model: User, as: 'author', attributes: ['id', 'fullName', 'avatarUrl'] },
        { model: Answer, as: 'answers', attributes: ['id'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    return res.json({ success: true, count: questions.length, questions });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch questions', error: error.message });
  }
};

export const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findByPk(id, {
      include: [
        { model: User, as: 'author', attributes: ['id', 'fullName', 'avatarUrl'] },
        {
          model: Answer,
          as: 'answers',
          include: [{ model: User, as: 'author', attributes: ['id', 'fullName', 'avatarUrl'] }]
        }
      ]
    });
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }
    await question.increment('viewCount');
    return res.json({ success: true, question });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch question', error: error.message });
  }
};

export const createQuestion = async (req, res) => {
  try {
    const { title, body, tags } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Question title is required' });
    }
    const question = await Question.create({
      title,
      body,
      tags,
      userId: req.user?.id || null
    });
    return res.status(201).json({ success: true, question });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to post question', error: error.message });
  }
};

export const addAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req.body;
    if (!body) {
      return res.status(400).json({ success: false, message: 'Answer body is required' });
    }
    const question = await Question.findByPk(id);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }
    const answer = await Answer.create({
      body,
      questionId: id,
      userId: req.user?.id || null
    });
    return res.status(201).json({ success: true, answer });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to post answer', error: error.message });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findByPk(id);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }
    await question.destroy();
    return res.json({ success: true, message: 'Question deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete question', error: error.message });
  }
};
