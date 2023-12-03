const mongoose = require('mongoose');

const materialBookmarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  material: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudyMaterial',
    required: true,
  },
  bookmarkedAt: {
    type: Date,
    default: Date.now,
  },
  // You can include additional fields as needed for your bookmarks
  // For example: notes, tags, etc.
});

const MaterialBookmark = mongoose.model('MaterialBookmark', materialBookmarkSchema);

module.exports = MaterialBookmark;
