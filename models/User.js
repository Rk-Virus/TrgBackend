const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index : true
    },
    phoneNo: {
        type: String,
        required: true,
        length : [10, '10 digit mobile number is required'],
        unique: true,
        index : true
    },
    gender:{
        type: String,
        required: true,
        enums:["male", "female", "other"]
    },
    dob: {
        type: Date,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        default: "English"
    },
    verifyCode:{
        type: Number,
        default: null,
        length: [4,"4 digit OTP"]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    profilePic: {
         // can be of Buffer type 
         type: String,
         default: ""
    },
    location : {
        type : {
            type : String,
            default : 'Point'
        },
        coordinates : {
            type : [Number],
            default : [0,0],
            index : '2dsphere'
        }
    },
    ownedMaterials: [{
        material : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Material'
        },
        purchasedAt : {
            type : Date,
            default: Date.now()
        }
    }],
    
})


// --------Hashing password------------------------
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12)
    }
    next();
})

userSchema.pre('findOneAndUpdate', async function (next) {
    if (this._update.password) {
        this._update.password = await bcrypt.hash(this._update.password, 12);
    }
    next();
});


// --------Comparing password------------------------
userSchema.methods.comparePassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password)
    } catch (err) {
        console.log(err)
    }
}

// --------generatingToken----------------------------
userSchema.methods.getToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
        //jwt expires in JWT_EXPIRE days
        expiresIn: Math.floor(Date.now() / 1000) + process.env.JWT_EXPIRE * 24 * 60 * 60
    })
}

module.exports = mongoose.model('User', userSchema)