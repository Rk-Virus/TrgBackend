const mongoose = require('mongoose')

const carouselSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    imgUrl: {
         // can be of Buffer type 
         type: String,
         required:true
    },
    description: {
        type: String,
        default: ""
   },
    
})

module.exports = mongoose.model('User', carouselSchema)