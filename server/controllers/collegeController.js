import { Op } from 'sequelize';
import { College, Course, CollegeCourse, ApprovalBody, CollegeApproval, Review, Category } from '../models/index.js';

export const getColleges = async (req, res) => {
  try {
    const { 
      search, 
      category, 
      state, 
      city, 
      universityType, 
      isFeatured, 
      limit = 20, 
      offset = 0,
      sortBy = 'rating',
      order = 'DESC'
    } = req.query;

    const whereClause = { status: 'active' };

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { city: { [Op.like]: `%${search}%` } },
        { state: { [Op.like]: `%${search}%` } },
        { shortName: { [Op.like]: `%${search}%` } }
      ];
    }

    if (state) whereClause.state = state;
    if (city) whereClause.city = city;
    if (universityType) whereClause.universityType = universityType;
    if (isFeatured !== undefined) whereClause.isFeatured = isFeatured === 'true';

    const includeOptions = [
      {
        model: CollegeCourse,
        as: 'collegeCourses',
        include: [{ model: Course, as: 'course' }]
      },
      {
        model: ApprovalBody,
        through: { attributes: ['grade', 'validTill'] }
      }
    ];

    if (category) {
      includeOptions[0].include[0].where = {
        name: { [Op.like]: `%${category}%` }
      };
    }

    const { count, rows } = await College.findAndCountAll({
      where: whereClause,
      include: includeOptions,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, order.toUpperCase()]],
      distinct: true
    });

    return res.json({
      success: true,
      total: count,
      colleges: rows
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch colleges', error: error.message });
  }
};

export const getCollegeBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const college = await College.findOne({
      where: { slug },
      include: [
        {
          model: CollegeCourse,
          as: 'collegeCourses',
          include: [{ model: Course, as: 'course' }]
        },
        {
          model: ApprovalBody,
          through: { attributes: ['grade', 'validTill'] }
        },
        {
          model: Review,
          as: 'collegeReviews',
          required: false,
          where: { status: 'Approved' }
        }
      ]
    });

    if (!college) {
      return res.status(404).json({ success: false, message: 'College not found' });
    }

    return res.json({
      success: true,
      college
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch college details', error: error.message });
  }
};

export const compareColleges = async (req, res) => {
  try {
    const { ids } = req.query; // comma-separated ids e.g. "1,2,3"
    if (!ids) {
      return res.status(400).json({ success: false, message: 'Provide comma-separated college IDs or slugs to compare' });
    }

    const idList = ids.split(',').map(s => s.trim()).filter(Boolean);

    const colleges = await College.findAll({
      where: {
        [Op.or]: [
          { id: { [Op.in]: idList.filter(x => !isNaN(x)).map(Number) } },
          { slug: { [Op.in]: idList } }
        ]
      },
      include: [
        {
          model: CollegeCourse,
          as: 'collegeCourses',
          include: [{ model: Course, as: 'course' }]
        },
        {
          model: ApprovalBody,
          through: { attributes: ['grade', 'validTill'] }
        }
      ]
    });

    return res.json({
      success: true,
      count: colleges.length,
      colleges
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Comparison error', error: error.message });
  }
};

export const createCollege = async (req, res) => {
  try {
    const data = req.body;
    if (!data.slug) {
      data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    const college = await College.create(data);
    return res.status(201).json({ success: true, college });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create college', error: error.message });
  }
};

export const updateCollege = async (req, res) => {
  try {
    const { id } = req.params;
    const college = await College.findByPk(id);
    if (!college) {
      return res.status(404).json({ success: false, message: 'College not found' });
    }
    await college.update(req.body);
    return res.json({ success: true, college });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update college', error: error.message });
  }
};

export const deleteCollege = async (req, res) => {
  try {
    const { id } = req.params;
    const college = await College.findByPk(id);
    if (!college) {
      return res.status(404).json({ success: false, message: 'College not found' });
    }
    await college.destroy();
    return res.json({ success: true, message: 'College deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete college', error: error.message });
  }
};
