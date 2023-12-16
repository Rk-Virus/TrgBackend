const mongoose = require('mongoose');

const paidQuizSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true,
  },
  purchasedAt: {
    type: Date,
    default: Date.now,
  },
  // You can include additional fields as needed for your bookmarks
  // For example: notes, tags, etc.
});

const PaidQuiz = mongoose.model('PaidQuiz', paidQuizSchema);

module.exports = PaidQuiz;
