
const sendToken =  (user, res)=>{
    const token = user.getToken()
    console.log(token)
    res.cookie("jwtoken", token, {
        expires: new Date(Date.now()+7*24*60*60),
        httpOnly: true
    })
    res.status(201).json({
        msg : "Success!",
        response : { token,  user }
    })
}

module.exports = {sendToken}