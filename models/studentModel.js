const dbConfig = require('../dbConfig');
const mssql = require('mssql');
const existModel = require('../models/existModel');
const studentModel = {

    getCourseByStudentId: async function (studentId) {
        try {
            const pool = await mssql.connect(dbConfig);
            const result = await pool
                .request()
                .input('studentId', mssql.Int, studentId)
                .query(`
                SELECT 
                    Courses.CourseName,
                    Courses.Description AS CourseCode,
                    Users.FirstName,
                    Materials.Title,
                    Courses.Semester , Courses.Grade
                FROM StudentCourses
                INNER JOIN Users ON StudentCourses.StudentID = Users.ID
                INNER JOIN Courses ON StudentCourses.CourseID = Courses.ID
                INNER JOIN Materials ON Courses.MaterialsID = Materials.ID
                WHERE StudentCourses.StudentId = @studentId
            `);
            console.log('Öğrencinin Dersleri  : ', result);
            if (result.recordset.length >= 0) {
                return result.recordset; // Eğer birden fazla ders dönecekse
            }
            else {
                console.error('Öğrenci dersi sorgusu beklenen sonucu döndürmedi.');
                return { error: 'Öğrenci dersi sorgusu beklenen sonucu döndürmedi.' };
            }
        } catch (err) {
            console.error('Error : ', err);
            return { error: err.message }; // Hata durumunda bir nesne döndür
        }

    },
    selectCourseByStudentId: async function (studentId, courseId) {
        try {
            const enrollmentCheck = await existModel.existingEnrollment(studentId, courseId);
            if (enrollmentCheck.success) {
                const pool = await mssql.connect(dbConfig);
    
                // Ders kaydını eklemek için sorguyu yap
                const result = await pool.request()
                    .input('studentId', mssql.Int, studentId)
                    .input('courseId', mssql.Int, courseId)
                    .query(`
                        INSERT INTO StudentCourses (StudentID, CourseID) VALUES 
                        (@studentId, @courseId);
                        
                    `);
                    if (result.rowsAffected && result.rowsAffected[0] > 0) {
                        // Eğer başarıyla eklendiyse, eklenen kaydın ID'sini alabilirsiniz.
                        return { success: 'Ders kaydınız başarıyla yapıldı.' };
                    } else {
                        // Eğer kayıt eklenemediyse bir hata döndür
                        return { error: 'Ders kaydını eklerken bir hata oluştu.' };
                    }
            } else {
                // Eğer daha önce alınmışsa hata döndür
                return enrollmentCheck;
            }
        } catch (error) {
            // Hata durumunda hata mesajını ve bir hata nesnesini döndür
            console.error('Error: ', error);
            return { error: 'Ders kaydı sırasında bir hata oluştu.' };
        }
    }
    
}

module.exports = studentModel;