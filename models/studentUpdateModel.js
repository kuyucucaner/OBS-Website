const connect = require('../dbConfig');
const mssql = require('mssql');



const User = {
    updateMembershipStatus: async function (studentNo, verificationCode) {
        let pool;
        try {
            pool = await mssql.connect(connect);    
            const result = await pool
            .request()
            .input('studentNo', mssql.NVarChar, studentNo)
            .input('verificationCode', mssql.NVarChar, verificationCode)
            .query('UPDATE Users SET IsActivated = 1 WHERE StudentNo = @studentNo AND VerificationCode = @verificationCode');
        
        if (result.rowsAffected[0] > 0) {
            return true; // Güncelleme başarılı oldu
        } else {
            return false; // Güncelleme başarısız oldu
        }
          
                } catch (error) {
            console.error('Üyelik durumu güncelleme sırasında bir hata oluştu:', error);
            throw new Error('Üyelik durumu güncelleme sırasında bir hata oluştu.');
        } finally {
            if (pool) {
                pool.close();
            }
        }
    },
    
      
};

module.exports = User;