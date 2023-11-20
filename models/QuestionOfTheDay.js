const mongoose = require('mongoose');

const questionOfTheDaySchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
  },
  answer: {
    type: String,
    required: true,
    trim: true,
  },
  // Additional fields as needed (e.g., options, category, etc.)
  // For example:
  options: {
    type: [String],
    default: [],
  },
  category: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  // Add more fields as needed
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

const QuestionOfTheDay = mongoose.model('QuestionOfTheDay', questionOfTheDaySchema);

module.exports = QuestionOfTheDay;
