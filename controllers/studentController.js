const studentModel = require('../models/studentModel');
const studentController = {
    getCourseByStudentID: async function (req, res) {
        try { 
            const studentId = req.params.studentId;
            const studentCourses = await studentModel.getCourseByStudentId(studentId);
    
            if (studentCourses && !studentCourses.error) {
                return res.status(200).json({ success: 'Öğrenciye ait dersler başarı ile getirildi.', studentCourses : studentCourses });
            } else {
                const errorMessage = studentCourses ? studentCourses.error : 'Öğrenciye ait dersleri alma hatası!';
                req.flash('error', errorMessage);
                return res.status(500).json({ error: errorMessage });
            }
        } catch (error) {
            console.error('Hata:', error);
            return res.status(500).json({ error: 'Bir hata oluştu.' });
        }
    },
    
    selectCourseByStudentIdController: async function (req, res) {
        try {
            const studentId = req.params.userId; // req.param.id yerine req.params.id kullanılmalı
            const courseId = req.body.course; // req.body üzerinden courseId'yi al
            const result = await studentModel.selectCourseByStudentId(studentId, courseId);
            console.log("Student ID :" , studentId + " " +  "Course ID : ", courseId);
            console.log("Request Body  :" , req.body);
            console.log('Request Params : ', req.params);
            console.log('Result: ', result);

            if (result && result.success) {
                return res.status(200).json({ success: 'Öğrenci dersi başarı ile aldı.' });
            }else {
                // Hata durumunda
                const errorMessage = 'Öğrenci zaten derse sahip!';
                req.flash('error', errorMessage);
                return res.status(500).json({ error: errorMessage });
            }
        } catch (error) {
            console.error('Hata:', error);
            return res.status(500).json({ error: 'Bir hata oluştu.' });
        }
    }
    
};

module.exports = studentController;