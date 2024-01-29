const connect = require('../dbConfig');
const sql = require('mssql');

const Exist = {
    checkEmailExistence: async function (email) {
        try {
            const pool = await sql.connect(connect);
            const queryResult = await pool
                .request()
                .input('email', sql.NVarChar, email)
                .query('SELECT COUNT(*) AS count FROM Users WHERE Email = @email');
            const userCount = queryResult.recordset[0].count;
            return userCount > 0;
        } catch (error) {
            console.error('E-posta varlığı kontrolü sırasında bir hata oluştu:', error);
        }
    },  
    existingEnrollment: async function (studentId, courseId) {
        try {
            const pool = await sql.connect(connect);
            const queryResult = await pool.request()
                .input('studentId', sql.Int, studentId)
                .input('courseId', sql.Int, courseId)
                .query(`
                    SELECT * FROM StudentCourses 
                    WHERE StudentID = @studentId AND CourseID = @courseId
                `);
            console.log('Ders Zaten Ekli : ', queryResult);
            if (queryResult.recordset.length > 0) {
                return { error: 'Bu dersi daha önce aldınız.' };
            } else {
                return { success: 'Ders daha önce alınmamış.' };
            }
        } catch (err) {
            console.error('Error : ', err);
            return { error: err.message }; 
        }
    }    
};

module.exports = Exist;