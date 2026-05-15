/**
 * seed.js — populates MongoDB with the full question bank.
 * Usage:  npm run seed
 */
const mongoose = require('mongoose');
require('dotenv').config();
const Question = require('./models/Question');

const questions = [
  // ── Emotional (E) ──────────────────────────────────────────────────────────
  { text: "How often have you felt nervous or 'stressed'?",                                              category: 'E', reverse: false },
  { text: "How often have you felt sudden irritability or anger over small things?",                     category: 'E', reverse: false },
  { text: "How often have you felt that things were going your way?",                                    category: 'E', reverse: true  },
  { text: "How often have you felt an overwhelming sense of sadness or loneliness?",                     category: 'E', reverse: false },
  { text: "How often have you felt unable to control the irritating annoyances of your life?",           category: 'E', reverse: false },
  { text: "How often have you felt emotionally drained at the end of the day?",                          category: 'E', reverse: false },

  // ── Physical (P) ───────────────────────────────────────────────────────────
  { text: "How often have you felt unable to relax your muscles or felt physical tension?",              category: 'P', reverse: false },
  { text: "How often have you experienced disrupted sleep or fatigue due to worry?",                     category: 'P', reverse: false },
  { text: "How often have you experienced tension headaches or muscle pain?",                            category: 'P', reverse: false },
  { text: "How often have you felt a 'tightness' in your chest when thinking about your tasks?",         category: 'P', reverse: false },
  { text: "How often have you experienced changes in appetite due to stress?",                           category: 'P', reverse: false },
  { text: "How often have you felt physically exhausted even after resting?",                            category: 'P', reverse: false },

  // ── Mental/Cognitive (M) ───────────────────────────────────────────────────
  { text: "How often have you felt unable to control the important things in your life?",                category: 'M', reverse: false },
  { text: "How often have you felt confident about your ability to handle your personal problems?",      category: 'M', reverse: true  },
  { text: "How often have you found that you could not cope with all the things you had to do?",         category: 'M', reverse: false },
  { text: "How often have you felt unable to deal with the stress of your day-to-day life?",             category: 'M', reverse: false },
  { text: "How often have you struggled to concentrate or focus on a single task?",                      category: 'M', reverse: false },
  { text: "How often have you felt that your mind is racing and won't stop?",                            category: 'M', reverse: false }
];

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mindcheck';
  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB');

  await Question.deleteMany({});
  const inserted = await Question.insertMany(questions);
  console.log(`🌱 Seeded ${inserted.length} questions (6 per category × 3 categories)`);

  await mongoose.connection.close();
  console.log('🔒 Connection closed. Ready to go!');
}

seed().catch(err => { console.error('❌ Seed failed:', err); process.exit(1); });
