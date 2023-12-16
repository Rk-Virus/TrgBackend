const mongoose = require('mongoose');

const paidMaterialSchema = new mongoose.Schema({
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
  purchasedAt: {
    type: Date,
    default: Date.now,
  },
  // You can include additional fields as needed for your bookmarks
  // For example: notes, tags, etc.
});

const PaidMaterial = mongoose.model('PaidMaterial', paidMaterialSchema);

module.exports = PaidMaterial;
