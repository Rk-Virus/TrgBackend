const mongoose = require('mongoose');

const noteBookmarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  note: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note',
    required: true,
  },
  bookmarkedAt: {
    type: Date,
    default: Date.now,
  },
  // You can include additional fields as needed for your bookmarks
  // For example: notes, tags, etc.
});

const NoteBookmark = mongoose.model('NoteBookmark', noteBookmarkSchema);

module.exports = NoteBookmark;
