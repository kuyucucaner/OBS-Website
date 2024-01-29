var express = require('express');
var router = express.Router();
const registerController = require('../controllers/registerController');
const loginController = require('../controllers/loginController');
const authenticateService = require('../auth/authService');
const { verificationController } = require('../controllers/verificationController');
const courseController  = require('../controllers/courseController');
const examController  = require('../controllers/examController');
const courseModel = require('../models/courseModel');
const studentModel = require('../models/studentModel');
const studentController = require('../controllers/studentController');
const noteController = require('../controllers/noteController');
const NoteModel = require('../models/noteModel');
const profileController = require('../controllers/profileController');
const profileModel = require('../models/profileModel');
// HOME
router.get('/home', authenticateService.authenticateToken ,function(req, res, next) {
  res.render('home', { title: 'Caner University' });
});

//REGISTER
router.post('/register', registerController.RegisterUserController);

router.get('/register', (req, res) => {
  res.render('register', { errors: [], title : 'Caner University' }); // errors değişkeni boş bir array olarak geçilir
});

// LOGİN 
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Caner University' });
});

router.post('/login' , loginController.login);

// VERİFİCATİON
router.get('/verification', (req, res) => {
  res.render('verification', { errors: [], title : 'Caner University' }); // errors değişkeni boş bir array olarak geçilir
});

router.post('/verification' , verificationController.joinClub);
// NAVBAR
router.get('/navbar', (req, res) => {
  res.render('navbar', { errors: [], title : 'Caner University' }); // errors değişkeni boş bir array olarak geçilir
});
//EXAM
router.get('/exam', authenticateService.authenticateToken, async (req, res) => {
  try {
    const examsResponse = await examController.getAllExamsController(req, res);
    if (examsResponse.error) {
      // Hata durumunu işle
      console.error(examsResponse.error);
      return res.status(500).send('Internal Server Error');
    }
    const exams = examsResponse.exams;
    // Sayfa yenilemeyi zorlamak için önbellek kontrol başlıklarını ayarla
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', 0);
    res.render('exam', { errors: [], title: 'Caner University', exams: exams });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

router.get('/exams', examController.getAllExamsController);

router.post('/addExam', examController.addExamController);
//PROFİLE
router.get('/profile', authenticateService.authenticateToken,async  (req, res) => {
  const userId = req.user.ID; // Kullanıcının ID'si
  const studentNo = req.user.studentNo;
  const teacherCourses = await courseModel.getCourseByTeacherId(userId);
  const studentCourses = await studentModel.getCourseByStudentId(userId)
  const profileUser = await profileModel.getUserByStudentNo(studentNo);
  console.log('profile user : ' , profileUser);
  console.log('req.user : ' , req.user);
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', 0);
  res.render('profile', { errors: [], title: 'Caner University', user: profileUser , teacherCourses: teacherCourses, studentCourses : studentCourses});
});

router.get('/profile-user', profileController.getUserByStudentNoController);

router.post('/update-profile-user' , profileController.updateProfileController);

router.post('/update-profile' , profileController.updateUsersController);
//NOTE
router.get('/note', authenticateService.authenticateToken,async  (req, res) => {
  const userId = req.user.ID;
  const courseId = req.query.courseId;
  const notes = await NoteModel.getNotesByStudentID(userId);
  const courses = await courseModel.getCourseByTeacherId(userId);
  const students = await NoteModel.getStudentByCourseID(courseId);
  console.log('Students: ', students);
  console.log('Students by Notes: ', students.studentsByNotes);
  res.render('note', { errors: [], title: 'Caner University', user: req.user , notes : notes , courses : courses ,  students: students});
});
router.get('/student/:courseId' , noteController.getStudentByCourseIDController);

router.post('/add-note', noteController.addNoteByStudentNoController);

//PERSONEL COURSES 
router.get('/personelCourse', authenticateService.authenticateToken,async  (req, res) => {
  const userId = req.user.ID; // Kullanıcının ID'si
  const teacherCourses = await courseModel.getCourseByTeacherId(userId);
  const studentCourses = await studentModel.getCourseByStudentId(userId)
  res.render('personelCourse', { errors: [], title: 'Caner University', user: req.user, teacherCourses: teacherCourses , studentCourses : studentCourses});
});
//COURSE
router.get('/course',authenticateService.authenticateToken, async (req, res) => {
  try {
    const coursesResponse = await courseController.getAllCoursesController(req, res);
    if (coursesResponse.error) {
      console.error(coursesResponse.error);
      return res.status(500).send('Internal Server Error');
    }
  
    const courses = coursesResponse.courses;
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', 0);
    res.render('course', { errors: [], title: 'Caner University', courses: courses , user : req.user});
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

router.get('/course/:id', courseController.getCourseByTeacherID);

router.get('/courses', courseController.getAllCoursesController);

router.get('/selectCourse/:studentId', studentController.getCourseByStudentID);

router.post('/selectCourse/:userId', studentController.selectCourseByStudentIdController);

router.post('/addCourse', courseController.addCourseController);
// LOGOUT
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.clearCookie('refreshToken');
  res.clearCookie('id');
  res.redirect('/'); // Çıkış yapıldıktan sonra anasayfaya yönlendir
});
module.exports = router;
