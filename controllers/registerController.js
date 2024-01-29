const { check, validationResult } = require('express-validator');
const registerModel = require('../models/registerModel');
const existModel = require('../models/existModel');
const sendMailModel = require('../models/sendMailModel');

const registerController = {
    RegisterUserController: [
        check('email')
            .isEmail()
            .withMessage('Invalid email format.')
            .custom(async (value) => {
                const isEmailExists = await existModel.checkEmailExistence(value);
                if (isEmailExists) {
                    throw new Error('E-mail already in use');
                }
            }),
        check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
        check('confirmPassword').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match.');
            }
            return true;
        }),
        async function (req, res) {
            // Hataları kontrol et
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const errorMessages = errors.array().map(error => error.msg);
                const errorMessage = errorMessages.join(' ');
                req.flash('error', errorMessage);
                return res.status(400).json({ error: errorMessage });
            }
            try {
                const result = await registerModel.registerUser({ ...req.body });
                if (result.verificationCode && result.studentNo) {
                    const userEmail = req.body.email;
                    const emailSubject = 'Üyelik Onayı';
                    const emailText = `
                    Merhaba,
            
                    Üyeliğinizi tamamlamak için aşağıdaki bilgileri kullanabilirsiniz:
            
                    Öğrenci Numarası: ${result.studentNo}
                    Doğrulama Kodu: ${result.verificationCode}
            
                    Caner University
                `;
                  await sendMailModel.sendEmail(userEmail, emailSubject, emailText);
                }                
                req.flash('success', 'Kullanıcı başarıyla kaydedildi!');
                return res.status(200).json({ success: 'User successfully registered' });
            } catch (error) {
                const errorMessage = 'Kullanıcı kayıt Hatası!';
                req.flash('error', errorMessage);
                return res.status(500).json({ error: errorMessage });
            }
        }
    ],
};

module.exports = registerController;