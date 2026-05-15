const express  = require('express');
const router   = express.Router();
const Question = require('../models/Question');
const Session  = require('../models/Session');

// ── Helpers ─────────────────────────────────────────────────────────────────
function classifyStress(percentage, primaryCategory) {
  if (percentage < 25) {
    return { stressType: 'Minimal Stress', stressDescription: 'You are in a balanced state. Keep practicing mindfulness and self-care — you\'re doing great.' };
  }
  if (percentage < 50) {
    return { stressType: 'Mild Stress', stressDescription: 'You\'re experiencing manageable tension. Consider scheduling regular breaks and setting clearer personal boundaries.' };
  }
  if (percentage < 75) {
    const map = {
      E: { stressType: 'Emotional Burnout',  stressDescription: 'Your stress is primarily emotional. You may feel overwhelmed or drained — journaling and social support can help.' },
      P: { stressType: 'Physical Stress',    stressDescription: 'Stress is manifesting in your body. Prioritise sleep hygiene, gentle exercise, and hydration.' },
      M: { stressType: 'Cognitive Overload', stressDescription: 'Your mind is overloaded. Try task-batching, digital detox periods, and mindfulness meditation.' }
    };
    return map[primaryCategory] || map['M'];
  }
  return { stressType: 'Severe Stress', stressDescription: 'Your stress levels are critically elevated. We strongly encourage you to speak with a healthcare professional or counsellor soon.' };
}

// ── GET /api/questions/random ────────────────────────────────────────────────
// Returns 9 shuffled questions (3 per category) for one quiz session
router.get('/questions/random', async (req, res) => {
  try {
    const categories = ['E', 'P', 'M'];
    let selected = [];

    for (const cat of categories) {
      const questions = await Question.aggregate([
        { $match: { category: cat } },
        { $sample: { size: 3 } }
      ]);
      selected = [...selected, ...questions];
    }

    // Shuffle so categories are interleaved
    selected = selected.sort(() => Math.random() - 0.5);

    res.json({ success: true, questions: selected, total: selected.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/sessions ───────────────────────────────────────────────────────
// Create a new session and return its ID
router.post('/sessions', async (req, res) => {
  try {
    const { questionIds } = req.body;
    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      return res.status(400).json({ success: false, message: '`questionIds` array is required.' });
    }
    const session = new Session({ questionIds });
    await session.save();
    res.status(201).json({ success: true, sessionId: session._id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/sessions/:id/submit ────────────────────────────────────────────
// Submit all answers for a session; calculates & persists results
router.post('/sessions/:id/submit', async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session)           return res.status(404).json({ success: false, message: 'Session not found.' });
    if (session.completed)  return res.status(400).json({ success: false, message: 'Session already completed.' });

    const { answers } = req.body; // [{ questionId, category, reverse, rawValue }]
    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ success: false, message: '`answers` array is required.' });
    }

    const scores = { E: 0, P: 0, M: 0 };

    const processedAnswers = answers.map(a => {
      const finalValue = a.reverse ? (4 - a.rawValue) : a.rawValue;
      scores[a.category] = (scores[a.category] || 0) + finalValue;
      return { questionId: a.questionId, category: a.category, rawValue: a.rawValue, finalValue };
    });

    const totalScore  = scores.E + scores.P + scores.M;
    const maxPossible = answers.length * 4;
    const percentage  = Math.round((totalScore / maxPossible) * 100);

    const primaryCategory = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    const { stressType, stressDescription } = classifyStress(percentage, primaryCategory);

    Object.assign(session, {
      answers: processedAnswers,
      scores,
      totalScore,
      maxPossible,
      percentage,
      primaryCategory,
      stressType,
      stressDescription,
      completed: true
    });
    await session.save();

    res.json({
      success: true,
      result: { scores, totalScore, maxPossible, percentage, primaryCategory, stressType, stressDescription }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/sessions/:id ────────────────────────────────────────────────────
// Retrieve a completed session by ID
router.get('/sessions/:id', async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate('answers.questionId', 'text category');
    if (!session) return res.status(404).json({ success: false, message: 'Session not found.' });
    res.json({ success: true, session });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/stats ───────────────────────────────────────────────────────────
// Aggregate statistics across all completed sessions
router.get('/stats', async (req, res) => {
  try {
    const [aggregate] = await Session.aggregate([
      { $match: { completed: true } },
      {
        $group: {
          _id: null,
          totalSessions: { $sum: 1 },
          avgPercentage: { $avg: '$percentage' },
          avgE: { $avg: '$scores.E' },
          avgP: { $avg: '$scores.P' },
          avgM: { $avg: '$scores.M' }
        }
      }
    ]);

    const stressTypeDistribution = await Session.aggregate([
      { $match: { completed: true } },
      { $group: { _id: '$stressType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const categoryDistribution = await Session.aggregate([
      { $match: { completed: true, primaryCategory: { $exists: true } } },
      { $group: { _id: '$primaryCategory', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      stats: aggregate || { totalSessions: 0, avgPercentage: 0, avgE: 0, avgP: 0, avgM: 0 },
      stressTypeDistribution,
      categoryDistribution
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
