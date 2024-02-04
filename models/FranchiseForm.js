const mongoose = require('mongoose');

const franchiseFormSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
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
    city:{
        type: String,
        required: true
    },
    state:{
        type: String,
        required: true
    },
},
{ timestamps: true }
)

const FranchiseForm = mongoose.model("FranchiseForm", franchiseFormSchema);

module.exports = FranchiseForm