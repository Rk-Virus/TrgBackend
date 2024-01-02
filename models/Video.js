const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  title: {
    type: String,
    default:'',
    trim: true,
  },
  description: {
    type: String,
    default:'',
    trim: true,
  },
  videoId: {
    type: String,
    required:true,
    trim: true,
  },
  // Add more fields as needed
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

const Video = mongoose.model('Video', VideoSchema);

module.exports = Video;
