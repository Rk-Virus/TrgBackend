const mongoose = require('mongoose');

const studyMaterialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['revision notes', 'support material', 'syllabus','assignment','ncert book','ncert solutions','previous year question paper'], // Adjust based on your quiz types
  },
  course: {
    type: String,
    required: true,
    enum: ['cbse', 'icse'], // Adjust based on your quiz types
  },
  class: {
    type: Number,
    enum: [1,2,3,4,5,6,7,8,9,10,11,12]
  },
  subject: {
    type: String,
    enum: ["maths", "science", "english", "hindi", "social studies", "sanskrit", "computer science"]
  },
  pdfUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  isPaid:{
    type:Boolean,
    default:false,
  },
  price:{
    type:Number,
    required:false,
    default:0,
  }
});

const StudyMaterial = mongoose.model('StudyMaterial', studyMaterialSchema);

module.exports = StudyMaterial;
