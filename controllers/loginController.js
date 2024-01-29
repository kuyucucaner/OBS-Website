const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dbConfig = require('../dbConfig');
const mssql = require('mssql');

const loginController = {
    login: async function (req, res) {
        try {
            //DATABASE
            const { studentNo, password, rememberMe } = req.body;
            console.log('Login Request:', { studentNo, password, rememberMe });
            
            const pool = await mssql.connect(dbConfig);
            const request = pool.request();
            const result = await request
                .input('studentNo', mssql.Int, studentNo)
                .query('SELECT * FROM Users WHERE StudentNo = @studentNo');
            if (result.recordset.length === 0) {
                console.log('Geçersiz Öğrenci Numarası  :', studentNo);
                req.flash('error', 'Geçersiz Öğrenci Numarası');
                return res.status(401).json({ error: 'Geçersiz Öğrenci Numarası' });
            }
            const user = result.recordset[0];
            // IsActivated kontrolü
            if (!user.IsActivated) {
                console.log('Kullanıcı Aktive Edilmemiş:', user.StudentNo);
                req.flash('error', 'Hesabınız aktive edilmemiştir. Lütfen e-postanızı kontrol ederek hesabınızı aktive edin.');
                return res.status(401).json({ error: 'Kullanıcı Aktive Edilmemiş' });
            }
            // PASSWORD 
            if (!bcrypt.compareSync(password, user.Password)) {
                req.flash('error', 'Geçersiz Şifre');
                return res.status(401).json({ error: 'Geçersiz Şifre' });
            }
            //REMEMBER ME 
            console.log('Request Body : ', req.body);
            const isRememberMe = rememberMe === 'on' ;
            console.log('Is Remember Me Checked:', isRememberMe);
            if (isRememberMe) {
                // Beni Hatırla işaretlendiyse, kullanıcı adı ve şifreyi tarayıcıda sakla
                res.cookie('rememberedStudentNo', studentNo, { httpOnly: false, secure: true });
                res.cookie('rememberedPassword', password, { httpOnly: false, secure: true });
            } else {
                // Beni Hatırla işaretli değilse, önceki hatırlama bilgilerini temizle
                res.clearCookie('rememberedStudentNo');
                res.clearCookie('rememberedPassword');
            }
            //JWT
            const accessToken = jwt.sign({
                ID: user.ID, studentNo: user.StudentNo,
                firstName: user.FirstName, lastName: user.LastName,
                email: user.Email, role: user.Role,
                faculty: user.Faculty, department: user.Department,
                class: user.Class, address: user.Address,
                phoneNumber: user.PhoneNumber, emergencyPhoneNumber: user.EmergencyPhoneNumber,
                GPA: user.GPA, internShip: user.Internship
            }
                , process.env.JWT_ACCESSECRETKEY, { expiresIn: '10m' });
            const refreshToken = jwt.sign({
                ID: user.ID, studentNo: user.StudentNo,
                firstName: user.FirstName, lastName: user.LastName,
                email: user.Email, role: user.Role,
                faculty: user.Faculty, department: user.Department,
                class: user.Class, address: user.Address,
                phoneNumber: user.PhoneNumber, emergencyPhoneNumber: user.EmergencyPhoneNumber,
                GPA: user.GPA, internShip: user.Internship
            }
                , process.env.JWT_REFRESHSECRETKEY, { expiresIn: '15m' });
            console.log('accessToken:', accessToken);
            console.log('refreshToken:', refreshToken);
            console.log("ID : ", user.ID + ' ' + "Öğrenci Numarası : ", user.StudentNo);
            // res.header('Authorization', `Bearer ${accessToken}`).send(successScript);
            // const csrfToken = generateCsrfToken();
            // res.cookie('csrfToken', csrfToken, { httpOnly: true, secure: true });
            res.cookie('token', accessToken, { httpOnly: true, secure: true });
            res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
            res.cookie('id', user.ID, { httpOnly: false, secure: true });
            return res.status(200).json({ success: true, message: 'Başarılı Giriş!', user });
        } catch (error) {
            console.error('Login Error:', error);
            req.flash('error', 'Internal Server Error.');
            return res.status(500).redirect('/');
        }
    },
}



module.exports = loginController;