const dbConfig = require('../dbConfig');
const mssql = require('mssql');

const profileModel = {
    setUserByStudentNo: async function (studentNo , email , address , phoneNumber , ephoneNumber) {
        try {
            const pool = await mssql.connect(dbConfig);
            const result = await pool.request()
            .input('studentNo' , mssql.Int, studentNo)
            .input('email' , mssql.NVarChar, email || 'BOŞ')
            .input('address' , mssql.NVarChar, address || 'BOŞ')
            .input('phoneNumber' , mssql.NVarChar, phoneNumber || 'BOŞ')
            .input('emergencyPhoneNumber', mssql.NVarChar, ephoneNumber || 'BOŞ')
            .query(`
            UPDATE Users 
            SET Email = @email , Address = @address , PhoneNumber = @phoneNumber , EmergencyPhoneNumber = @emergencyPhoneNumber
            WHERE StudentNo = @studentNo
            `);
            if (result && result.rowsAffected && result.rowsAffected.length > 0 && result.rowsAffected[0] === 1) {
                console.log('Kullanıcı başarıyla güncellenmiştir.');
                return { success: 'Kullanıcı başarıyla güncellenmiştir.' };
            } else {
                console.error('Kullanıcı güncelleme sorgusu beklenen sonucu döndürmedi.');
                console.error(result); // Hata mesajını detaylı bir şekilde yazdır
                return { error: 'Kullanıcı güncelleme sorgusu beklenen sonucu döndürmedi.' };
            }
        } catch (err) {
            console.error('Hata: ', err);
            return { error: 'Kullanıcı güncelleme sırasında bir hata oluştu: ' + err.message };
        }
    },
    getUserByStudentNo: async function (studentNo) {
        try {
            const pool = await mssql.connect(dbConfig);
            const result = await pool
                .request()
                .input('studentNo', mssql.Int, studentNo)
                .query(`
                SELECT *
                FROM Users
                WHERE StudentNo = @studentNo
            `);
            console.log('Kullanıcı Profil Bilgileri  : ', result);
            if (result.recordset.length > 0) {
                return result.recordset[0]; // Sadece ilk kullanıcıyı döndür
            }
            else {
                console.error('Kullanıcı profil sorgusu beklenen sonucu döndürmedi.');
                return { error: 'Kullanıcı profil sorgusu beklenen sonucu döndürmedi.' };
            }
        } catch (err) {
            console.error('Error : ', err);
            return { error: err.message }; // Hata durumunda bir nesne döndür
        }

    },
    updateProfile: async function (studentNo, address , phoneNumber ,ephoneNumber) {
        try {
            const pool = await mssql.connect(dbConfig);
            const result = await pool.request()
                .input('studentNo', mssql.Int, studentNo)
                .input('address', mssql.NVarChar, address || 'BOŞ')
                .input('phoneNumber', mssql.NVarChar, phoneNumber || 'BOŞ')
                .input('emergencyPhoneNumber', mssql.NVarChar, ephoneNumber || 'BOŞ')
                .query(`
                    UPDATE Users 
                    SET Address = @address, PhoneNumber = @phoneNumber , EmergencyPhoneNumber = @emergencyPhoneNumber 
                    WHERE StudentNo = @studentNo 
                `);
            if (result && result.rowsAffected && result.rowsAffected.length > 0 && result.rowsAffected[0] === 1) {
                console.log('Kullanıcı başarıyla güncellenmiştir.');
                return { success: 'Kullanıcı başarıyla güncellenmiştir.' };
            } else {
                console.error('Kullanıcı güncelleme sorgusu beklenen sonucu döndürmedi.');
                return { error: 'Kullanıcı güncelleme sorgusu beklenen sonucu döndürmedi.' };
            }
        } catch (err) {
            console.error('Hata: ', err);
            return { error: 'Kullanıcı ekleme sırasında bir hata oluştu: ' + err.message };
        }
    }   
}
module.exports = profileModel;