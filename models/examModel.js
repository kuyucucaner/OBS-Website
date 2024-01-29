const dbConfig = require('../dbConfig');
const mssql = require('mssql');

const ExamModel = {
    addExam: async function (exam) {
        try {
            const pool = await mssql.connect(dbConfig);
            const result = await pool.request()
            .input('courseId', mssql.Int,  exam.courseId)
            .input('date', mssql.DateTime, exam.date)
            .input('materialsId', mssql.Int, exam.materialsId)
            .query(`INSERT INTO Exams (CourseID, Date, MaterialsID) 
                    VALUES (@courseId, @date, @materialsId)`);
            console.log('result:', result);
            if (result.rowsAffected && result.rowsAffected[0] === 1) {
                console.log('Sınav başarıyla eklenmiştir.');
             }
              else {
                console.error('Sınav ekleme sorgusu beklenen sonucu döndürmedi.');
                return { error: 'Sınav ekleme sorgusu beklenen sonucu döndürmedi.' };
            }
        } catch (err) {
            console.error('Error : ', err);
            return { error: err.message }; // Hata durumunda bir nesne döndür
        }
    },
    getAllExams: async function () {
        try {
          const pool = await mssql.connect(dbConfig);
          const result = await pool.request()
          .query(`
          SELECT Exams.ID, Courses.CourseName, Courses.Description AS CourseDescription,
                 Exams.Date, Materials.Title
          FROM Exams
          INNER JOIN Courses ON Exams.CourseID = Courses.ID
          INNER JOIN Materials ON Exams.MaterialsID = Materials.ID
        `);
          return result.recordset;
        } catch (err) {
          console.error(err);
          throw err;
        }
      },
      
}

module.exports = ExamModel;