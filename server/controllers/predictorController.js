import { Op } from 'sequelize';
import { Cutoff, College, Course, EntranceExam } from '../models/index.js';

// Classifies admission probability by comparing the candidate's rank against
// the most recent closing rank on record for that college/course/category.
const classify = (rank, closingRank) => {
  if (rank <= closingRank * 0.7) return 'High Chance';
  if (rank <= closingRank) return 'Moderate Chance';
  if (rank <= closingRank * 1.15) return 'Low Chance';
  return null; // Outside realistic range — excluded from results
};

export const predictColleges = async (req, res) => {
  try {
    const { examSlug } = req.params;
    const { rank, category = 'General' } = req.query;

    if (!rank || isNaN(Number(rank))) {
      return res.status(400).json({ success: false, message: 'A valid numeric rank/score is required' });
    }

    const exam = await EntranceExam.findOne({ where: { slug: examSlug } });
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    const rankNum = Number(rank);

    const cutoffs = await Cutoff.findAll({
      where: {
        entranceExamId: exam.id,
        category,
        closingRank: { [Op.gte]: Math.floor(rankNum * 0.6) } // pre-filter, final bucketing below
      },
      include: [
        { model: College, as: 'college', attributes: ['id', 'name', 'slug', 'city', 'state', 'logoUrl', 'rating', 'nirfRanking'] },
        { model: Course, as: 'course', attributes: ['id', 'name', 'level'] }
      ],
      order: [['closingRank', 'ASC']]
    });

    const results = cutoffs
      .map((c) => {
        const status = classify(rankNum, c.closingRank);
        if (!status) return null;
        return {
          college: c.college,
          course: c.course,
          category: c.category,
          year: c.year,
          round: c.round,
          openingRank: c.openingRank,
          closingRank: c.closingRank,
          status
        };
      })
      .filter(Boolean);

    return res.json({
      success: true,
      exam: { id: exam.id, name: exam.name, shortName: exam.shortName, slug: exam.slug },
      rank: rankNum,
      category,
      count: results.length,
      results
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Prediction failed', error: error.message });
  }
};

export const createCutoff = async (req, res) => {
  try {
    const cutoff = await Cutoff.create(req.body);
    return res.status(201).json({ success: true, cutoff });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create cutoff', error: error.message });
  }
};

export const deleteCutoff = async (req, res) => {
  try {
    const { id } = req.params;
    const cutoff = await Cutoff.findByPk(id);
    if (!cutoff) {
      return res.status(404).json({ success: false, message: 'Cutoff not found' });
    }
    await cutoff.destroy();
    return res.json({ success: true, message: 'Cutoff deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete cutoff', error: error.message });
  }
};
