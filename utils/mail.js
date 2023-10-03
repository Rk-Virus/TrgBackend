const nodemailer = require("nodemailer");

// ===== sending mail =========
const sendMail = async (email, verifyCode) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            // secure:true,
            requireTLS: true,
            auth: {
                // sender's details
                user: process.env.SENDER_EMAIL,
                pass: process.env.EMAIL_PASS
            }
        });

        const info = await transporter.sendMail({
            from: `"The Right Guru Team" <${process.env.SENDER_EMAIL}>`, // sender address
            to: email, // list of receivers
            subject: "Email Verification Code", // Subject line
            html: `<b>Hi ${email}</b> <br/> Here is your email verification code : <b>${verifyCode}</b>  `, // html body
        });

        console.log("Email sent: %s", info.messageId);
    }
    catch (err) {
        console.log(err)
    }
}

module.exports = sendMail