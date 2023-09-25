const {check, validationResult} = require('express-validator')

exports.validateUserSignUp = [
    check('name').isString().withMessage('Invalid Name!'),
    check('email').normalizeEmail().isEmail().withMessage('Invalid Email'),
    check('phoneNo').isLength({min: 10, max:10}).withMessage('invalid Phone no'),
    check('password').isLength({min:6, max:20}).withMessage('Password must be at least 6 characters long'),
];

exports.userValidation = (req, res, next) => {
    const result = validationResult(req).array()
    console.log({result})
    if(!result.length) return next();
    const error = result[0].msg;
   return res.status(400).json({msg: error})
}