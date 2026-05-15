const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  category:   { type: String, enum: ['E', 'P', 'M'], required: true },
  rawValue:   { type: Number, min: 0, max: 4, required: true },
  finalValue: { type: Number, min: 0, max: 4, required: true }
});

const SessionSchema = new mongoose.Schema(
  {
    questionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    answers:     [AnswerSchema],
    scores: {
      E: { type: Number, default: 0 },
      P: { type: Number, default: 0 },
      M: { type: Number, default: 0 }
    },
    totalScore:       { type: Number },
    maxPossible:      { type: Number },
    percentage:       { type: Number },
    primaryCategory:  { type: String, enum: ['E', 'P', 'M'] },
    stressType:       { type: String },
    stressDescription:{ type: String },
    completed:        { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Session', SessionSchema);
