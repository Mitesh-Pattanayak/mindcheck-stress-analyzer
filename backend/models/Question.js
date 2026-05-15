const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema(
  {
    text:     { type: String, required: true, trim: true },
    category: { type: String, enum: ['E', 'P', 'M'], required: true },
    reverse:  { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Question', QuestionSchema);
