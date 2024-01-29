const { check, validationResult } = require('express-validator');
const studentUpdateModel = require('../models/studentUpdateModel');


const verificationController = {
    joinClub: [
        check('studentNo').notEmpty().withMessage('Student Number is required.'),
        check('verificationCode').notEmpty().withMessage('Secret code is required.'),
        async function (req, res) {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const errorMessages = errors.array().map(error => error.msg);
                const errorMessage = errorMessages.join(' ');
                req.flash('error', errorMessage);
                return res.status(400).json({ error: errorMessage });
            }
            try {
                const { studentNo, verificationCode } = req.body;
                const updateResult = await studentUpdateModel.updateMembershipStatus(studentNo, verificationCode);
                console.log('upadete', updateResult);
                if (updateResult) {
                    return res.status(200).json({ success: 'User successfully registered' });
                } else {
                    const errorMessage = 'Kullanıcı Onaylanamadı!';
                    return res.status(500).json({ error: errorMessage });
                }
            } catch (error) {
                const errorMessage = 'Kullanıcı Onaylanamadı!';  // Daha spesifik bir hata mesajı ekleyebilirsiniz.
                return res.status(500).json({ error: errorMessage });
            }
        }
    ],

};

module.exports = {
    verificationController
};