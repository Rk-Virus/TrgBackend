const mongoose = require('mongoose');

const studentDoubtSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
    trim: true,
  },
  question: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  student: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
      // Add more user fields as needed
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

const StudentDoubt = mongoose.model('StudentDoubt', studentDoubtSchema);

module.exports = StudentDoubt;
