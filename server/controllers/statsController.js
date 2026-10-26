import { Review, College } from '../models/index.js';

export const getHomepageStats = async (req, res) => {
  try {
    return res.json({
      success: true,
      stats: {
        colleges: '2,500+',
        universities: '1,200+',
        courses: '50,000+',
        studentsAssisted: '10 Lakh+',
        enquiriesThisMonth: '25,000+',
        expertCounsellors: '500+',
        yearsOfExperience: '15+'
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getTestimonials = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { status: 'Approved' },
      limit: 6,
      order: [['createdAt', 'DESC']]
    });

    return res.json({
      success: true,
      testimonials: reviews
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
