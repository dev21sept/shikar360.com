import { CareerAssessment } from '../models/index.js';

// Static questionnaire: each option maps to one or more career categories it scores points for.
// Kept server-side so scoring logic and question set stay in sync, and so it can be
// extended/moved to the database later without changing the client contract.
export const CAREER_QUESTIONS = [
  {
    id: 'q1',
    text: 'Which activity sounds most interesting to you?',
    options: [
      { label: 'Building or fixing machines/gadgets', scores: { Engineering: 3 } },
      { label: 'Leading a team or planning a business', scores: { Management: 3 } },
      { label: 'Helping sick people get better', scores: { Medical: 3 } },
      { label: 'Debating, arguing a case, or writing contracts', scores: { Law: 3 } },
      { label: 'Painting, writing, or designing something creative', scores: { Arts: 3 } },
    ]
  },
  {
    id: 'q2',
    text: 'Which school subject do you enjoy the most?',
    options: [
      { label: 'Mathematics / Physics', scores: { Engineering: 2, Science: 2 } },
      { label: 'Economics / Business Studies', scores: { Management: 2, Commerce: 2 } },
      { label: 'Biology', scores: { Medical: 3 } },
      { label: 'Civics / Political Science', scores: { Law: 2 } },
      { label: 'Literature / Fine Arts', scores: { Arts: 3 } },
    ]
  },
  {
    id: 'q3',
    text: 'How do you prefer to solve problems?',
    options: [
      { label: 'Break it down logically, step by step', scores: { Engineering: 2, Science: 1 } },
      { label: 'Gather a team and delegate tasks', scores: { Management: 2 } },
      { label: 'Diagnose the root cause carefully', scores: { Medical: 2 } },
      { label: 'Research precedents and rules', scores: { Law: 2 } },
      { label: 'Trust intuition and creativity', scores: { Arts: 2 } },
    ]
  },
  {
    id: 'q4',
    text: 'Pick a dream workplace:',
    options: [
      { label: 'A tech company or R&D lab', scores: { Engineering: 2 } },
      { label: 'A corporate office or your own startup', scores: { Management: 2, Commerce: 1 } },
      { label: 'A hospital or clinic', scores: { Medical: 2 } },
      { label: 'A courtroom or law firm', scores: { Law: 2 } },
      { label: 'A studio, agency, or gallery', scores: { Arts: 2 } },
    ]
  },
  {
    id: 'q5',
    text: 'What matters most to you in a career?',
    options: [
      { label: 'Building things that scale and innovate', scores: { Engineering: 2 } },
      { label: 'Growth, leadership and earning potential', scores: { Management: 2, Commerce: 1 } },
      { label: 'Directly helping and healing people', scores: { Medical: 2 } },
      { label: 'Justice, structure and advocacy', scores: { Law: 2 } },
      { label: 'Self-expression and originality', scores: { Arts: 2 } },
    ]
  },
];

const CATEGORY_INFO = {
  Engineering: {
    title: 'Engineering & Technology',
    description: 'You think logically and enjoy building and solving technical problems. Consider B.Tech, BCA, or Diploma programmes in Engineering/CS.',
    courses: ['B.Tech', 'BCA', 'MCA'],
    categorySlug: 'engineering'
  },
  Management: {
    title: 'Management & Business',
    description: 'You have natural leadership instincts and enjoy strategy and growth. Consider BBA, B.Com, or MBA pathways.',
    courses: ['BBA', 'MBA', 'B.Com'],
    categorySlug: 'management'
  },
  Medical: {
    title: 'Medical & Healthcare',
    description: 'You are caring and detail-oriented, suited for healthcare and life sciences. Consider MBBS, B.Pharm, or Nursing.',
    courses: ['MBBS Abroad', 'B.Pharm', 'Nursing'],
    categorySlug: 'medical'
  },
  Law: {
    title: 'Law & Public Policy',
    description: 'You are analytical and persuasive, well-suited to legal and advocacy careers. Consider LLB / BA LLB.',
    courses: ['LLB'],
    categorySlug: 'law'
  },
  Arts: {
    title: 'Arts, Design & Humanities',
    description: 'You are creative and expressive, suited to design, media, and humanities careers. Consider BA, design, or mass communication programmes.',
    courses: ['BA', 'MA'],
    categorySlug: 'arts'
  },
  Commerce: {
    title: 'Commerce & Finance',
    description: 'You enjoy numbers, markets, and structured analysis. Consider B.Com, M.Com, or finance-focused degrees.',
    courses: ['B.Com', 'M.Com'],
    categorySlug: 'commerce'
  },
  Science: {
    title: 'Pure Sciences & Research',
    description: 'You are curious and analytical, well suited to scientific research and academia. Consider B.Sc. programmes.',
    courses: ['B.Sc'],
    categorySlug: 'science'
  },
};

export const getCareerQuestions = (req, res) => {
  return res.json({
    success: true,
    questions: CAREER_QUESTIONS.map((q) => ({
      id: q.id,
      text: q.text,
      options: q.options.map((o, idx) => ({ index: idx, label: o.label }))
    }))
  });
};

export const submitCareerAssessment = async (req, res) => {
  try {
    const { answers } = req.body; // { questionId: optionIndex }
    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ success: false, message: 'Answers are required' });
    }

    const scores = {};
    CAREER_QUESTIONS.forEach((q) => {
      const selectedIdx = answers[q.id];
      const option = q.options[selectedIdx];
      if (!option) return;
      Object.entries(option.scores).forEach(([category, points]) => {
        scores[category] = (scores[category] || 0) + points;
      });
    });

    const topCategory = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Engineering';
    const info = CATEGORY_INFO[topCategory];

    const assessment = await CareerAssessment.create({
      userId: req.user?.id || null,
      answers: JSON.stringify(answers),
      topCategory,
      scores: JSON.stringify(scores),
      recommendation: info.description
    });

    return res.status(201).json({
      success: true,
      assessment: {
        id: assessment.id,
        topCategory,
        scores,
        ...info
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to process assessment', error: error.message });
  }
};

export const getMyCareerAssessments = async (req, res) => {
  try {
    const assessments = await CareerAssessment.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: 5
    });
    const mapped = assessments.map((a) => ({
      id: a.id,
      topCategory: a.topCategory,
      recommendation: a.recommendation,
      createdAt: a.createdAt,
      info: CATEGORY_INFO[a.topCategory]
    }));
    return res.json({ success: true, assessments: mapped });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch assessments', error: error.message });
  }
};
