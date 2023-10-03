const User = require('../models/User')
const sendMail = require('../utils/mail')
const { sendToken } = require('../utils/tokenUtils')

// ======= registering user ============
const registerUser = async (req, res) => {
    // destructuring from request body
    const { name, email, phoneNo, gender, password } = req.body
    if (!name || !email || !phoneNo || !password || !gender) {
        return res.status(422).json({ msg: "one or more field required" })
    }
    try {
        const query = { $or: [{ email }, { phoneNo }] }
        // checking if user exist
        const foundUser = await User.findOne(query)

        if (foundUser && foundUser.isVarified) {
            return res.status(409).json({ msg: "User already exist" })
        } else {
            await User.deleteOne(query)
            console.log("Non verified existing user deleted")
        }
        
        // generating a 6-digit code
        const verifyCode = Math.floor(100000 + Math.random() * 900000);

        // sending verification mail
        await sendMail(email, verifyCode)

        const user = new User({...req.body, verifyCode})
        user.save().then(savedUser => {
            if (savedUser) sendToken(savedUser, res)
        }).catch(err => {
            console.log(err)
        })

    } catch (err) {
        console.log(err)
        await User.deleteOne({ email })
        res.status(500).json({ msg: "something went wrong", error: err.message })
    }
}

//=== checking verification code =====
const verifyCode = async (req, res) => {
    try {
        const {email, verifyCode} = req.body
        // checking if user exist
        const foundUser = await User.findOne({ email })

        // matching codes
        if (foundUser.verifyCode != verifyCode) return res.status(401).json({msg:"Invalid verification code!"})

        //if matched
        foundUser.isVarified = true;
        await foundUser.save()
        return res.status(200).json({msg:"Email verified successfully!"})

    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "something went wrong", error: err })
    }
}


// ============Login User===============
const loginUser = async (req, res) => {
    const { phoneNoOrEmail, password } = req.body;
    if (!phoneNoOrEmail || !password) return res.status(422).json({ msg: "one or more fields required" })
    try {
        const foundUser = await User.findOne({
            $or: [{ email: phoneNoOrEmail }, { phoneNo: phoneNoOrEmail }],
        });
        if (!foundUser) return res.status(401).json({ msg: "Incorrect phone number/email or password" })
        if (!foundUser.isVarified) return res.status(401).json({ msg: "Sorry, Email isn't verified yet!" })

        console.log(foundUser)

        const isMatching = await foundUser.comparePassword(password);
        if (!isMatching) return res.status(401).json({ msg: "Either phoneNo or password is wrong" })

        if (foundUser && isMatching) {
            sendToken(foundUser, res)
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "something went wrong", error: err })
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
        const { phoneNo, password } = req.body
        const foundUser = await User.findOne({ phoneNo })
        if (!foundUser) {
            return res.status(404).json({ msg: "User doesn't exist with provided phone number" })
        }

        foundUser.password = password
        await foundUser.save()
        res.status(200).json({ msg: 'success' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "something went wrong", error: error })
    }

}

// ============= update profile ====================
const updateProfile = async (req, res) => {
    try {
        let update = {
            ...req.body
        }
        const updatedProfile = await User.findOneAndUpdate({ _id: req.body._id }, update, { new: true })
        if (!updatedProfile) return res.status(404).json({ msg: 'user not found' })
        res.status(200).json({ msg: 'success', response: updatedProfile })
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "something went wrong", error: err })
    }
}




// a test function
const test = () => {
    console.log("it's working")
}

module.exports = {
    registerUser, loginUser,
    // checkIfUserExist,
    updatePassword, updateProfile, sendMail, verifyCode
}