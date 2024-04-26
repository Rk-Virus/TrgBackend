const mongoose = require('mongoose');

const NoteSchema
 = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['academics', 'government exams'],
   },
  course: {
    type: String,
    required: false,
    enum: ['ssc pre', 'ssc mts', 'ssc chsl', 'ssc cgl', 'ssc cpo', 'ssc (je)', 'ssc (steno)', 'ssc gd', 'special maths', 'gs foundation', 'special gs', 'ssc mains english', 'ssc mains maths','dsssb','up constable','dp head constable', 'rrb (group d)', 'rpf constable', 'delhi police','hssc', 'clat', 'railway', 'cds', ' bank po', 'ibps so'], // Adjust based on  govt exams list
  },
  class: {
    type: Number,
    enum: [1,2,3,4,5,6,7,8,9,10,11,12]
  },
  subject: {
    type: String,
    enum: ["hindi", "english", "maths", "science", "social studies", "sanskrit", "computer science", "environmental studies", "rhymes", "general knowledge", "french", "urdu", "punjabi", "drawing", "reasoning", "home science", "history", "geography", "political science", "economics", "physical education", "psychology", "yoga", "spanish", "sociology", "accountancy", "business studies", "entrepreneurship development", "german", "physics", "chemistry", "biology", "information technology", "vocational", "maths standards", "maths basics", "legal studies", "fine arts", "hindi elective", "hindi core", "engineering graphics", "health and wellness", "beauty parlour", "retail", "web designing", "automobile", "data analytics"]
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

const Note = mongoose.model('Note', NoteSchema
);

module.exports = Note;
