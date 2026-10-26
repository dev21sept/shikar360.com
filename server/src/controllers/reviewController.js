import { Review, College } from '../models/index.js';

export const createReview = async (req, res) => {
  try {
    const { collegeId, courseName, rating, title, content } = req.body;
    if (!collegeId || !content) {
      return res.status(400).json({ success: false, message: 'College and review content are required' });
    }
    const college = await College.findByPk(collegeId);
    if (!college) {
      return res.status(404).json({ success: false, message: 'College not found' });
    }

    const review = await Review.create({
      collegeId,
      userId: req.user.id,
      studentName: req.user.fullName,
      universityName: college.name,
      courseName,
      rating: rating || 5,
      title,
      content,
      status: 'Approved'
    });

    // Keep the college's aggregate rating/reviewCount in sync
    const allApproved = await Review.findAll({ where: { collegeId, status: 'Approved' } });
    const avgRating = allApproved.reduce((sum, r) => sum + r.rating, 0) / allApproved.length;
    await college.update({ rating: Math.round(avgRating * 10) / 10, reviewCount: allApproved.length });

    return res.status(201).json({ success: true, review });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to submit review', error: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    await review.destroy();
    return res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete review', error: error.message });
  }
};
