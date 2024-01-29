const noteModel = require('../models/noteModel');


const noteController = {
    getNotesByStudentIDController: async function (req, res) {
            try { 
                const studentId = req.params.id;
                console.log('student ıd : ', studentId);
                await noteModel.getNotesByStudentID(studentId);
                return res.status(200).json({ success: 'Öğrenciye ait notlar başarı ile getirildi.' });
            } catch (error) {
                const errorMessage = 'Öğrenciye ait notları alma hatası!';
                req.flash('error', errorMessage);
                return res.status(500).json({ error: errorMessage });
            }
        },
        getStudentByCourseIDController: async function (req, res) {
            try {
              const courseId = req.query.courseId;
              console.log('Ders ID : ', courseId);
              const students = await noteModel.getStudentByCourseID(courseId);
        
              if (students.error) {
                const errorMessage = 'Ders için öğrenci bilgileri getirilirken hata oluştu!';
                req.flash('error', errorMessage);
                return res.status(500).json({ error: errorMessage });
              }
              console.log('Students : ' , students);
              return res.status(200).json({ success: 'Derse ait öğrenciler başarı ile getirildi.' });
            } catch (error) {
              console.error('Öğrenci bilgileri alınırken hata:', error);
              const errorMessage = 'Ders için öğrenci bilgileri getirilirken hata oluştu!';
              req.flash('error', errorMessage);
              return res.status(500).json({ error: errorMessage });
            }
          },
          addNoteByStudentNoController: async function (req, res) {
            try {
                console.log('İstek Gövdesi: ', req.body);
                console.log('studentId: ',req.body.StudentID);
                console.log('courseId: ', req.body.CourseID);
                console.log('note: ',req.body.Note);
                
                const result = await noteModel.addNoteByStudentNo(req.body.StudentID, req.body.CourseID, req.body.Note);

                if (result.error) {
                    console.error('Not ekleme sorgusu beklenen sonucu döndürmedi.');
                    return res.status(500).json({ error: 'Not ekleme sorgusu beklenen sonucu döndürmedi.' });
                }
        
                console.log('Not başarıyla eklenmiştir.');
                return res.status(200).json({ success: 'Not başarıyla eklendi.' });
            } catch (error) {
                console.error('Hata: ', error);
                return res.status(500).json({ error: 'Not eklenirken bir hata oluştu: ' + error.message });
              }
        }
        
        
};

module.exports = noteController;