const User = require('../models/User')
const { sendToken } = require('../utils/tokenUtils')
// const { successResponse } = require('../utils/response');

 const registerUser = async(req, res)=>{
    // destructuring details from request body
    const {name, email, phoneNo, gender, password } = req.body
    if(!name || !email || !phoneNo || !password || !gender){
        return res.status(422).json({msg : "one or more field required"})
    }
    try{
        const foundUser = await User.findOne({$or : [{email}, {phoneNo}]})
        if(foundUser) return res.status(409).json({msg : "User already exist"})

        const user = new User(req.body)

        user.save().then(savedUser=>{
            if(savedUser) sendToken(savedUser, res)
        }).catch(err=>{
            console.log(err)
        })

    }catch(err){
        console.log(err)
        await User.deleteOne({email})
        res.status(500).json({msg : "something went wrong", error : err.message})
    }
}


// ============Login User===============
 const loginUser = async (req, res) =>{
    const { phoneNoOrEmail, password } = req.body;
    if(!phoneNoOrEmail || !password) return res.status(422).json({msg : "one or more fields required"})
    try {
        const foundUser = await User.findOne({
            $or: [{ email: phoneNoOrEmail }, { phoneNo: phoneNoOrEmail }],
          });
        if(!foundUser) return res.status(401).json({msg : "Incorrect phone number/email or password"})

        console.log(foundUser)

        const isMatching =  await foundUser.comparePassword(password);
        if(!isMatching) return res.status(401).json({msg : "Either phoneNo or password is wrong"})

        if(foundUser && isMatching){
            sendToken(foundUser, res)
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({msg : "something went wrong", error : err})
    }
}

// const checkIfUserExist = async (req, res) => {
//     try {
//         const {phoneNo} = req.body
//         const foundUser = await User.findOne({phoneNo})
//         if(!foundUser) return res.status(404).json({msg : "User doesn't exist with provided phone number"})
//         res.status(200).json({msg : 'success'})
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({msg : "something went wrong", error : error})
//     }
// }


// ---------------- update Password ------------------------
const updatePassword = async (req, res) => {
    try {
        const {phoneNo, password} = req.body
        const foundUser = await User.findOne({phoneNo})
        if(!foundUser) {
            return res.status(404).json({msg : "User doesn't exist with provided phone number"})
        }

        foundUser.password = password
        await foundUser.save()
        res.status(200).json({msg : 'success'})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg : "something went wrong", error : error})
    }

}

// ============fetch User===============
const fetchUser = async (req, res) =>{
    try {
        return res.status(200).json({msg : "success", response : req.user})

    } catch (err) {
        console.log(err)
        res.status(500).json({msg : "something went wrong", error : err.message})
    }
}

// ====================== update profile =============================
const updateProfile = async (req, res) => {
    try {
        let update = {
            ...req.body
        }
        const updatedProfile = await User.findByIdAndUpdate(req.body._id, update, {new : true})
        if(!updatedProfile) return res.status(404).json({msg : 'user not found'})
        res.status(200).json({msg : 'success', response : updatedProfile})
    } catch (err) {
        console.log(err)
        res.status(500).json({msg : "something went wrong", error : err})
    }
}




module.exports = {
      registerUser, loginUser, 
    // checkIfUserExist,
     updatePassword,
      fetchUser, updateProfile
    }