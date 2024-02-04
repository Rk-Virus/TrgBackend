const mongoose = require('mongoose');

const careerFormSchema = new mongoose.Schema({
    fname:{
        type: String,
        required: true
    },
    lname:{
        type: String
    },
    fullname:{
        type: String
    },
    email:{
        type: String,
        trim: true,
        lowercase: true,
        required: true
    },
    status:{
        type: String,
        default: 'New',
        required: true
    },
    phone:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    country:{
        type: String,
        required: true
    },
    position:{
        type: String,
        required: true
    },
    additional:{
        type: String
    },
    file:{
        type: String,
        required: true
    },
},
{ timestamps: true }
)

const CareerForm = mongoose.model("CareerForm", careerFormSchema);

module.exports = CareerForm;