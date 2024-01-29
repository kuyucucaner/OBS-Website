const courseModel = require('../models/courseModel');
const courseController = {
    addCourseController:
        async function (req, res) {
            try {
                await courseModel.addCourse(req.body);
                return res.status(200).json({ success: 'Course successfully added.' });
            } catch (error) {
                const errorMessage = 'Kurs kayıt Hatası!';
                req.flash('error', errorMessage);
                return res.status(500).json({ error: errorMessage });
            }
        },
    getCourseByTeacherID: async function (req, res) {
            try { 
                const teacherId = req.params.id;
                await courseModel.getCourseByTeacherId(teacherId);
                return res.status(200).json({ success: 'Öğretmene ait dersler başarı ile getirildi.' });
            } catch (error) {
                const errorMessage = 'Öğretmene ait dersleri alma hatası!';
                req.flash('error', errorMessage);
                return res.status(500).json({ error: errorMessage });
            }
        },
    getAllCoursesController: async function (req, res) {
        try {
          const courses = await courseModel.getAllCourses();
          console.log(courses); 
          return { courses }; // JSON olarak döndürme, res.json yerine doğrudan obje döndürme
        } catch (err) {
          console.error(err);
          return { error: 'Internal Server Error' }; // Hata durumunda da obje döndürme
        }
      },
};

module.exports = courseController;