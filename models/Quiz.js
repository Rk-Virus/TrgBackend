const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  course: {
    type: String,
    required: true,
    enum: ['cbse', 'icse', 'ssc','cuet','clat','dsssb','police'], // Adjust based on your quiz types
  },
  class: {
    type: Number,
    enum: [1,2,3,4,5,6,7,8,9,10,11,12]
  },
  subject: {
    type: String,
    enum: ["english", "mathmatics", "sst", "hindi", "sanskrit", "science"]
  },
  questions:{
    type: [String],
    default:[]
  },
  duration: {
    type: Number, // Assuming duration is in minutes
    required: true,
    min: 1, // Minimum duration in minutes
  },
  length: {
    type: Number, // Assuming length is the number of questions in the quiz
    required: true,
    min: 1, // Minimum length (number of questions) of the quiz
  },
  difficultyLevel: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard'], // Adjust based on your difficulty levels
  },
  markForEach: {
    type: Number,
    required: true,
    min: 1, // Minimum marks for each question
  },
  negativeMark: {
    type: Number,
    required: true,
    min: 0, // Minimum negative mark (set to 0 if there's no negative marking)
  },
  totalMarks: {
    type: Number,
    required: true,
    validate: {
      validator: function () {
        // Ensure totalMarks is the product of markForEach and length
        return this.totalMarks === this.markForEach * this.length;
      },
      message: 'Total marks must be the product of markForEach and length',
    },
  },
  // Add more fields as needed
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
