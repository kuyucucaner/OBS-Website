const dbConfig = require('../dbConfig');
const mssql = require('mssql');

const CourseModel = {
    addCourse: async function (course) {
        try {
            const pool = await mssql.connect(dbConfig);
            const result = await pool.request()
                .input('courseName', mssql.NVarChar, course.courseName)
                .input('description', mssql.NVarChar, course.description)
                .input('materialsId', mssql.Int, course.materialsId)
                .input('teacherId', mssql.Int, course.teacherId)
                .input('semester', mssql.NVarChar, course.semester)
                .input('grade', mssql.NVarChar, course.grade)
                .query(`INSERT INTO Courses (CourseName, Description, MaterialsID, TeacherID , Semester , Grade) 
                    VALUES (@courseName, @description, @materialsId, @teacherId , @semester , @grade)`);
            console.log('result:', result);
            if (result.rowsAffected && result.rowsAffected[0] === 1) {
                console.log('Ders başarıyla eklenmiştir.');
            }
            else {
                console.error('Ders ekleme sorgusu beklenen sonucu döndürmedi.');
                return { error: 'Ders ekleme sorgusu beklenen sonucu döndürmedi.' };
            }
        } catch (err) {
            console.error('Error : ', err);
            return { error: err.message }; // Hata durumunda bir nesne döndür
        }
    },
    getAllCourses: async function () {
        try {
            const pool = await mssql.connect(dbConfig);
            const result = await pool.request()
                .query(`
          SELECT Courses.ID , Courses.CourseName, Courses.Description AS CourseDescription,
                 Materials.Title, Users.FirstName AS TeacherName , Courses.Semester , Courses.Grade
          FROM Courses
          INNER JOIN Materials ON Courses.MaterialsID = Materials.ID
          INNER JOIN Users ON Courses.TeacherID = Users.ID
        `);
            mssql.close();
            return result.recordset;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    getCourseByTeacherId: async function (teacherId) {
        try {
            const pool = await mssql.connect(dbConfig);
            const result = await pool
                .request()
                .input('teacherId', mssql.Int, teacherId)
                .query(`SELECT Courses.ID ,Courses.CourseName, Courses.Description AS CourseCode, 
                Materials.Title, Users.FirstName,Users.LastName ,  Courses.Semester, Courses.Grade
                FROM Courses
                INNER JOIN Users ON Courses.TeacherID = Users.ID
                INNER JOIN Materials ON Courses.MaterialsID = Materials.ID
                WHERE Courses.TeacherID = @teacherId;
                `)
            console.log('Dersler : ', result);
            if (result.recordset.length >= 0) {
                return result.recordset; // Eğer birden fazla ders dönecekse
            }
            else {
                console.error('Öğretmene göre ders getirme sorgusu beklenen sonucu döndürmedi.');
                return { error: 'Öğretmene göre ders getirme sorgusu beklenen sonucu döndürmedi.' };
            }
        } catch (err) {
            console.error('Error : ', err);
            return { error: err.message }; // Hata durumunda bir nesne döndür
        }

    },
}

module.exports = CourseModel;