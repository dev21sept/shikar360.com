import { Course, Category, Specialization, CollegeCourse, College } from '../models/index.js';
import { Op } from 'sequelize';

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{ model: Course, as: 'courses', attributes: ['id', 'name', 'slug', 'level'] }]
    });
    return res.json({ success: true, categories });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch categories', error: error.message });
  }
};

export const getCourses = async (req, res) => {
  try {
    const { category, search, level, isPopular } = req.query;
    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { code: { [Op.like]: `%${search}%` } }
      ];
    }
    if (level) where.level = level;
    if (isPopular !== undefined) where.isPopular = isPopular === 'true';

    const courses = await Course.findAll({
      where,
      include: [
        { model: Category, as: 'category' },
        { model: Specialization, as: 'specializations' }
      ]
    });
    return res.json({ success: true, count: courses.length, courses });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch courses', error: error.message });
  }
};

export const getCourseBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const course = await Course.findOne({
      where: { slug },
      include: [
        { model: Category, as: 'category' },
        { model: Specialization, as: 'specializations' },
        {
          model: CollegeCourse,
          as: 'collegeOfferings',
          include: [{ model: College, as: 'college' }]
        }
      ]
    });

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    return res.json({ success: true, course });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch course', error: error.message });
  }
};

export const createCourse = async (req, res) => {
  try {
    const data = req.body;
    if (!data.slug) {
      data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    const course = await Course.create(data);
    return res.status(201).json({ success: true, course });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create course', error: error.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    await course.update(req.body);
    return res.json({ success: true, course });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update course', error: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    await course.destroy();
    return res.json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete course', error: error.message });
  }
};
