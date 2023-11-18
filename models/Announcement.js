const mongoose = require('mongoose');

// Define the Announcement schema
const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Create the Announcement model
const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement;
