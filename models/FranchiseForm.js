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
        unique: true,
        required: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
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