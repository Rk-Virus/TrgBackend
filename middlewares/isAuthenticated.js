const jwt = require('jsonwebtoken')
const User = require('../models/User')

const isAuthenticated = async (req, res, next) =>{
    try {
        let token
        if(req.headers.authorization){
            token = req.headers.authorization.split(' ')[1]
        }else{
            token = req.cookies.token
        }

        if(!token) return res.status(401).json({msg : "Please Login"})
    
        const decodedData =  jwt.verify(token, process.env.JWT_SECRET)
        const resp = await User.findById(decodedData._id).select("-password")
        req.user = resp;
        next()
    } catch (err) {
        console.log(err)
        res.status(500).json({msg : "something went wrong in authentication", error : err.message})
    }
}

module.exports = isAuthenticated