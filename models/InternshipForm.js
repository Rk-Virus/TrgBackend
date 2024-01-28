const mongoose = require('mongoose');

const internshipFormSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    },
    email:{
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    status:{
        type: String,
        default: 'New',
        required: true
    },
    address:{
        type: String,
        required: true
    },
    position:{
        type: String,
        required: true
    },
    exam:{
        type: String,
        required: true
    },
    language:{
        type: String,
        required: true
    },
    qualification:{
        type: String,
        required: true
    },
    subject:{
        type: String,
        required: true
    },
    experience:{
        type: String,
        required: true
    },
    demolink:{
        type: String,
    },
    youtubelink:{
        type: String,
    },
},
{ timestamps: true }
)

const InternshipForm = mongoose.model("InternshipForm", internshipFormSchema)

module.exports = InternshipForm;