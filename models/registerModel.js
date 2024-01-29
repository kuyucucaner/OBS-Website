const dbConfig = require('../dbConfig');
const mssql = require('mssql');
const bcrypt = require('bcrypt');
const generateRandomModel = require('../models/generateRandomModel');

const Register = {
    registerUser: async function (user, req) {
        try {
            const nextStudentNoResult = await mssql.query(`SELECT NEXT VALUE FOR StudentNoSeq AS NextStudentNo`);
            const nextStudentNo = parseInt(nextStudentNoResult.recordset[0].NextStudentNo);
            console.log('Result Before : ' , nextStudentNoResult)           
            console.log('Öğrenci Numarası : ', nextStudentNo);
            const verificationCode = generateRandomModel.generateRandomCode();
            const hashedPassword = await bcrypt.hash(user.password, 10);
            const pool = await mssql.connect(dbConfig);
            const result = await pool.request()
            .input('studentNo', mssql.Int,  parseInt(nextStudentNo))
            .input('firstName', mssql.NVarChar, user.firstName)
            .input('lastName', mssql.NVarChar, user.lastName)
            .input('password', mssql.NVarChar, hashedPassword)
            .input('verificationCode', mssql.NVarChar, verificationCode) 
            .input('email', mssql.NVarChar, user.email)
            .query(`INSERT INTO Users (StudentNo, FirstName, LastName, Password, VerificationCode ,Email) 
                    VALUES (@studentNo, @firstName, @lastName, @password,@verificationCode, @email)`);
            console.log('result:', result);
            // Eğer rowsAffected bilgisini kontrol etmek istiyorsanız:
            if (result.rowsAffected && result.rowsAffected[0] === 1) {
                console.log('Kullanıcı başarıyla eklenmiştir.');
                console.log('Öğrenci Numarası:', nextStudentNo);

                return { 
                    verificationCode,
                    studentNo: nextStudentNo,  
                };    
                } else {
                console.error('Kullanıcı ekleme sorgusu beklenen sonucu döndürmedi.');
                return { error: 'Kullanıcı ekleme sorgusu beklenen sonucu döndürmedi.' };
            }
        } catch (err) {
            console.error('Error : ', err);
            return { error: err.message }; // Hata durumunda bir nesne döndür
        }
    },
}

module.exports = Register;