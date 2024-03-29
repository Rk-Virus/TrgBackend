const sendToken =  (user, res)=>{
    const token = user.getToken()
    res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true
    }).status(201).json({
        msg : "Success!",
        response : { token,  user }
    })
}

module.exports = { sendToken }