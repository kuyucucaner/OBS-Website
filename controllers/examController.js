const examModel = require('../models/examModel');
const examController = {
    addExamController: [
        async function (req, res) {
            try {
                await examModel.addExam(req.body);
                return res.status(200).json({ success: 'Exam successfully added.' });
            } catch (error) {
                const errorMessage = 'Sınav kayıt Hatası!';
                req.flash('error', errorMessage);
                return res.status(500).json({ error: errorMessage });
            }
        }
    ],
    getAllExamsController: async function (req, res) {
      try {
        const exams = await examModel.getAllExams();
        console.log(exams);
        return { exams }; // JSON olarak döndürme, res.json yerine doğrudan obje döndürme
      } catch (err) {
        console.error(err);
        return { error: 'Internal Server Error' }; // Hata durumunda da obje döndürme
      }
    },
    
};

module.exports = examController;