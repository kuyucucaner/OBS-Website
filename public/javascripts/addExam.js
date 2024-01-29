
async function addExam() {
const courseId = document.getElementById('courseId').value;
const date = document.getElementById('datetime').value;
const materialsId = document.getElementById('materialsId').value;
console.log('materialsId:', materialsId);

    try {
        const response = await fetch('/addExam', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ courseId, date, materialsId}),
        });
        if (response.ok) {
            const responseBody = await response.json();
            if (responseBody.success) {
                // Başarılı giriş durumunda yönlendirme
                Swal.fire({
                    icon: 'success',
                    title: 'Sınav Kayıt İşlemi!',
                    html: '<p>Başarı ile ders oluşturuldu!</p>',
                    confirmButtonText: 'Tamam',
                }).then(() => {
                    // Yönlendirme işlemi
                    window.location.href = '/profile'; // Hedef sayfanın URL'sini buraya ekleyin
                });
            } else {
                console.error('Başarılı yanıt içermiyor:', responseBody);
            }
        }
        
         else {
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
            title: 'Kayıt Başarısız!',
            text: error.message || 'Lütfen bilgilerinizi kontrol edin.',
            confirmButtonText: 'Tamam',
        }).then(() => {
            // Yönlendirme işlemi
            window.location.href = '/profile'; // Hedef sayfanın URL'sini buraya ekleyin
        });
    }
}

document.getElementById('addExam').addEventListener('submit', async (event) => {
    event.preventDefault();
    await addExam();
});
