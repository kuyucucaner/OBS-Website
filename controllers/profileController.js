const profileModel = require('../models/profileModel');
const profileController = {
  getUserByStudentNoController: async function (req, res) {
    try {
      const studentNo = req.user.StudentNo;
      const user = await profileModel.getUserByStudentNo(studentNo);
      return { user }; // JSON olarak döndürme, res.json yerine doğrudan obje döndürme
    } catch (err) {
      console.error(err);
      return { error: 'Internal Server Error' }; // Hata durumunda da obje döndürme
    }
  },
  updateProfileController: async function (req, res) {
    try {
      console.log('İstek Gövdesi: ', req.body);
      console.log('Email : ', req.body.email);
      console.log('Adres : ', req.body.address);
      console.log('Telefon : ', req.body.phoneNumber);
      console.log('Acil Telefon : ', req.body.emergencyPhoneNumber);

      const result = await profileModel.setUserByStudentNo(
        parseInt(req.body.studentNo),
        req.body.email,
        req.body.address,
        req.body.phoneNumber,
        req.body.emergencyPhoneNumber
      );

      if (result.error) {
        console.error('Profil güncelleme sorgusu beklenen sonucu döndürmedi.');
        return res.status(500).json({ error: 'Profil güncelleme sorgusu beklenen sonucu döndürmedi.' });
      }
      return res.status(200).json({ success: 'Profil güncelleme başarılı.' });
    } catch (error) {
      console.error('Hata: ', error);
      return res.status(500).json({ error: 'Profil güncellenirken bir hata oluştu: ' + error.message });
    }
  },
  updateUsersController: async function (req, res) {
    try {
      console.log('İstek Gövdesi: ', req.body);
      console.log('Adres : ', req.body.address);
      console.log('Telefon : ', req.body.phoneNumber);
      console.log('Acil Telefon : ', req.body.emergencyPhoneNumber);

      const result = await profileModel.updateProfile(
        parseInt(req.body.studentNo),
        req.body.address,
        req.body.phoneNumber,
        req.body.emergencyPhoneNumber
      );

      if (result.error) {
        console.error('Profil güncelleme sorgusu beklenen sonucu döndürmedi.');
        return res.status(500).json({ error: 'Profil güncelleme sorgusu beklenen sonucu döndürmedi.' });
      }
      console.log('Not başarıyla eklenmiştir.');
      return res.status(200).json({ success: 'Profil güncelleme başarılı.' });
    } catch (error) {
      console.error('Hata: ', error);
      return res.status(500).json({ error: 'Profil güncellenirken bir hata oluştu: ' + error.message });
    }
  }


};

module.exports = profileController;