
const sendToken =  (user, res)=>{
    const token = user.getToken()
    res.cookie("jwtoken", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        httpOnly: true
    })
    res.status(201).json({
        msg : "Success!",
        response : { token,  user }
    })
}

const createError = (status, message) =>{
    const err = new Error();
    err.status = status
    err.message = message
    
    return err;
}

module.exports = { sendToken, createError }