import { MockTest, MockQuestion, MockAttempt, User } from '../models/index.js';

export const getMockTests = async (req, res) => {
  try {
    const tests = await MockTest.findAll({
      where: { status: 'Active' },
      include: [{ model: MockQuestion, as: 'questions', attributes: ['id'] }],
      order: [['createdAt', 'DESC']]
    });
    const withCounts = tests.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      durationMinutes: t.durationMinutes,
      negativeMarking: t.negativeMarking,
      marksPerQuestion: t.marksPerQuestion,
      questionCount: t.questions.length
    }));
    return res.json({ success: true, tests: withCounts });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch mock tests', error: error.message });
  }
};

// Returns the test WITHOUT the correct answers — safe to serve before/during an attempt
export const getMockTestForAttempt = async (req, res) => {
  try {
    const { id } = req.params;
    const test = await MockTest.findByPk(id, {
      include: [{ model: MockQuestion, as: 'questions', attributes: ['id', 'text', 'options', 'order'] }]
    });
    if (!test) {
      return res.status(404).json({ success: false, message: 'Mock test not found' });
    }
    const questions = test.questions
      .sort((a, b) => a.order - b.order)
      .map((q) => ({ id: q.id, text: q.text, options: JSON.parse(q.options) }));

    return res.json({
      success: true,
      test: {
        id: test.id,
        title: test.title,
        description: test.description,
        durationMinutes: test.durationMinutes,
        negativeMarking: test.negativeMarking,
        marksPerQuestion: test.marksPerQuestion,
        questions
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch mock test', error: error.message });
  }
};

export const submitMockAttempt = async (req, res) => {
  try {
    const { id } = req.params; // mockTestId
    const { answers, startedAt } = req.body; // answers: { questionId: selectedIndex }

    const test = await MockTest.findByPk(id, { include: [{ model: MockQuestion, as: 'questions' }] });
    if (!test) {
      return res.status(404).json({ success: false, message: 'Mock test not found' });
    }

    let correctCount = 0;
    let wrongCount = 0;
    let unattemptedCount = 0;

    test.questions.forEach((q) => {
      const selected = answers?.[q.id];
      if (selected === undefined || selected === null || selected === '') {
        unattemptedCount += 1;
      } else if (Number(selected) === q.correctIndex) {
        correctCount += 1;
      } else {
        wrongCount += 1;
      }
    });

    const score = (correctCount * test.marksPerQuestion) - (wrongCount * test.negativeMarking * test.marksPerQuestion);

    const attempt = await MockAttempt.create({
      mockTestId: id,
      userId: req.user.id,
      answers: JSON.stringify(answers || {}),
      score: Math.round(score * 100) / 100,
      correctCount,
      wrongCount,
      unattemptedCount,
      startedAt: startedAt || new Date(),
      submittedAt: new Date()
    });

    // Build a review list with correct answers + explanations now that the attempt is locked in
    const review = test.questions.map((q) => ({
      id: q.id,
      text: q.text,
      options: JSON.parse(q.options),
      correctIndex: q.correctIndex,
      selectedIndex: answers?.[q.id] !== undefined ? Number(answers[q.id]) : null,
      explanation: q.explanation
    }));

    return res.status(201).json({
      success: true,
      attempt: {
        id: attempt.id,
        score: attempt.score,
        correctCount,
        wrongCount,
        unattemptedCount,
        totalQuestions: test.questions.length,
        maxScore: test.questions.length * test.marksPerQuestion
      },
      review
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to submit attempt', error: error.message });
  }
};

export const getMyAttempts = async (req, res) => {
  try {
    const attempts = await MockAttempt.findAll({
      where: { userId: req.user.id },
      include: [{ model: MockTest, as: 'test', attributes: ['id', 'title'] }],
      order: [['createdAt', 'DESC']]
    });
    return res.json({ success: true, attempts });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch attempts', error: error.message });
  }
};

// ============ Admin: Mock Test authoring ============
export const createMockTest = async (req, res) => {
  try {
    const { title, description, durationMinutes, negativeMarking, marksPerQuestion, questions } = req.body;
    const test = await MockTest.create({ title, description, durationMinutes, negativeMarking, marksPerQuestion });

    if (Array.isArray(questions) && questions.length > 0) {
      await MockQuestion.bulkCreate(
        questions.map((q, idx) => ({
          mockTestId: test.id,
          text: q.text,
          options: JSON.stringify(q.options),
          correctIndex: q.correctIndex,
          explanation: q.explanation,
          order: idx
        }))
      );
    }

    return res.status(201).json({ success: true, test });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create mock test', error: error.message });
  }
};

export const deleteMockTest = async (req, res) => {
  try {
    const { id } = req.params;
    const test = await MockTest.findByPk(id);
    if (!test) {
      return res.status(404).json({ success: false, message: 'Mock test not found' });
    }
    await MockQuestion.destroy({ where: { mockTestId: id } });
    await test.destroy();
    return res.json({ success: true, message: 'Mock test deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete mock test', error: error.message });
  }
};
