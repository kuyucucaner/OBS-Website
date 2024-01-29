const dbConfig = require('../dbConfig');
const mssql = require('mssql');

const NoteModel = {
    getNotesByStudentID: async function (studentId) {
        try {
            const pool = await mssql.connect(dbConfig);
            const result = await pool.request()
                .input('studentId', mssql.Int, studentId)
                .query(`
                    SELECT Users.ID , Users.FirstName , Users.LastName , Users.StudentNo,
                    Courses.CourseName , Courses.Description , Courses.Semester , Courses.Grade,
                    StudentCourses.Note , StudentCourses.LetterGrade
                    FROM StudentCourses
                    INNER JOIN Users ON StudentCourses.StudentID = Users.ID
                    INNER JOIN Courses ON StudentCourses.CourseID = Courses.ID
                    WHERE StudentCourses.StudentID = @studentId
        `);
            console.log('Notlar : ', result);
            if (result.recordset.length > 0) {
                return result.recordset; // Eğer birden fazla ders dönecekse
            }
            else {
                console.error('Öğrenci not getirme sorgusu beklenen sonucu döndürmedi.');
                return { error: 'Öğrenci not getirme sorgusu beklenen sonucu döndürmedi.' };
            }
        } catch (err) {
            console.error('Error : ', err);
            return { error: err.message };
        }
    },
    getStudentsForNotes : async function () {
        try {
            const pool = await mssql.connect(dbConfig);
            const result = await pool.request()
                .query(`
                    SELECT Users.ID , Users.FirstName , Users.LastName , Users.StudentNo,
                    Courses.CourseName , Courses.Description , Courses.Semester , Courses.Grade,
                    StudentCourses.Note
                    FROM StudentCourses
                    INNER JOIN Users ON StudentCourses.StudentID = Users.ID
                    INNER JOIN Courses ON StudentCourses.CourseID = Courses.ID
                    WHERE StudentCourses.StudentID = @studentId
        `);
            console.log('Notlar : ', result);
            if (result.recordset.length > 0) {
                return result.recordset; // Eğer birden fazla ders dönecekse
            }
            else {
                console.error('Öğrenci not getirme sorgusu beklenen sonucu döndürmedi.');
                return { error: 'Öğrenci not getirme sorgusu beklenen sonucu döndürmedi.' };
            }
        } catch (err) {
            console.error('Error : ', err);
            return { error: err.message };
        }
    },
    getStudentByCourseID: async function (courseId) {
        try {
            const pool = await mssql.connect(dbConfig);
            const result = await pool.request()
                .input('courseId', mssql.Int, courseId)
                .query(`
                    SELECT Courses.CourseName, Courses.Description, Courses.Semester, Courses.Grade,
                    Users.FirstName, Users.LastName, Users.StudentNo,
                    StudentCourses.StudentID, StudentCourses.CourseID, StudentCourses.Note, StudentCourses.LetterGrade
                    FROM StudentCourses
                    INNER JOIN Users ON StudentCourses.StudentID = Users.ID
                    INNER JOIN Courses ON StudentCourses.CourseID = Courses.ID
                    WHERE StudentCourses.CourseID = @courseId
                `);
    
            console.log('Dersin Öğrencileri: ', result);
    
            if (result.recordset.length >= 0) {
                const notes = result.recordset.map(student => parseInt(student.Note));
                const averageNote = notes.reduce((sum, note) => sum + note, 0) / notes.length;
    
                console.log('Not Ortalaması: ', averageNote);
    
                return { studentsByNotes: result.recordset, averageNote };
            } else {
                console.error('Dersin öğrencileri getirme sorgusu boş döndü.');
                return { error: 'Dersin öğrencileri getirme sorgusu boş döndü.' };
            }
        } catch (err) {
            console.error('Error: ', err);
            return { error: err.message };
        }
    },
    
    
    addNoteByStudentNo: async function (studentId, courseId, note) {
        try {
            const pool = await mssql.connect(dbConfig);
            const letterGrade = calculateLetterGrade(note);
            const result = await pool.request()
                .input('studentId', mssql.Int, studentId)
                .input('courseId', mssql.Int, courseId)
                .input('note', mssql.NVarChar, note)
                .input('letterGrade', mssql.NVarChar, letterGrade)  // @letterGrade parametresini tanımla
                .query(`
                    UPDATE StudentCourses 
                    SET Note = @note ,
                    LetterGrade = @letterGrade
                    WHERE StudentID = @studentId AND CourseID = @courseId
                `);
         
        if (result && result.rowsAffected && result.rowsAffected.length > 0 && result.rowsAffected[0] === 1) {
            console.log('Not ve harf notu başarıyla güncellenmiştir.');
            return { success: 'Not ve harf notu başarıyla güncellenmiştir.' };
        } else {
            console.error('Not güncelleme sorgusu beklenen sonucu döndürmedi.');
            return { error: 'Not güncelleme sorgusu beklenen sonucu döndürmedi.' };
        }
        } catch (err) {
            console.error('Hata: ', err);
            return { error: 'Not ekleme sırasında bir hata oluştu: ' + err.message };
        }
    }
    
    
}
function calculateLetterGrade(note) {
    if (note >= 90) {
        return 'AA';
    } else if (note >= 80) {
        return 'BB';
    } else if (note >= 70) {
        return 'CC';
    } else if (note >= 60) {
        return 'DD';
    } else {
        return 'FF';
    }
  }
  
module.exports = NoteModel;