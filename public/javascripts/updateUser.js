document.getElementById('updateProfile').addEventListener('submit', async function (event) {
    event.preventDefault();
    await updateChanges();
});


async function updateChanges() {
    const studentNoElement = document.getElementById('studentNo');
    const studentNo = studentNoElement ? parseInt(studentNoElement.value, 10) : null;
    const emailElement = document.getElementById('email');
    const emailValue = emailElement ? emailElement.value : 'BOŞ';
    const addressElement = document.getElementById('address');
    const addressValue = addressElement ? addressElement.value : 'BOŞ';
    const phoneElement = document.getElementById('phoneNumber');
    const phoneValue = phoneElement ? phoneElement.value : 'BOŞ';
    const emergencyPhoneNumberElement = document.getElementById('emergencyPhoneNumber');
    const emergencyPhoneNumberValue = emergencyPhoneNumberElement ? emergencyPhoneNumberElement.value : 'BOŞ';

    console.log('studentNo: ', studentNo);
    console.log('emailElement: ', emailElement);
    console.log('emailValue: ', emailValue);
    console.log('addressElement: ', addressElement);
    console.log('addressValue: ', addressValue);
    console.log('phoneElement: ', phoneElement);
    console.log('phoneValue: ', phoneValue);
    console.log('emergencyPhoneNumberElement: ', emergencyPhoneNumberElement);
    console.log('emergencyPhoneNumberValue: ', emergencyPhoneNumberValue);
    try {
        const response = await fetch('/update-profile-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                studentNo: studentNo,
                email: emailValue,
                address: addressValue,
                phoneNumber: phoneValue,
                emergencyPhoneNumber: emergencyPhoneNumberValue,
            }),        
        })
        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Güncelleme Başarılı!',
                html: '<p>Başarı ile güncellendi!</p>',
                confirmButtonText: 'Tamam',
            }).then(() => {
                window.location.href = '/profile'; // Hedef sayfanın URL'sini buraya ekleyin
            });
        } else {
            const statusCode = response.status;
            console.error('Hata Durum Kodu:', statusCode);

            const responseBody = await response.json();

            if (statusCode === 400) {
                throw new Error(responseBody.error || 'Geçersiz Girdi.');
            } else {
                throw new Error(responseBody.error || `Sunucu Hatası: ${statusCode}`);
            }
        }
    } catch (error) {
        console.error('Hata Yakalandı:', error);
        Swal.fire({
            icon: 'error',
            title: 'Güncelleme Başarısız!',
            text: error.message || 'Lütfen bilgilerinizi kontrol edin.',
            confirmButtonText: 'Tamam',
        }).then(() => {
            window.location.href = '/profile'; // Hedef sayfanın URL'sini buraya ekleyin
        });
    }}
   

