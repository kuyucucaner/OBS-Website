
async function addCourse() {
    const courseName = document.getElementById('courseName').value;
    const description = document.getElementById('description').value;
    const materialsId = document.getElementById('materialsId').value;
    const teacherId = document.getElementById('teacherId').value;
    const semester = document.getElementById('semester').value;
    const grade = document.getElementById('grade').value;

    try {
        const response = await fetch('/addCourse', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ courseName, description, materialsId, teacherId , semester , grade }),
        });

        if (response.ok) {
            // Başarılı giriş durumunda yönlendirme
            Swal.fire({
                icon: 'success',
                title: 'Ders Kayıt İşlemi!',
                html: '<p>Başarı ile ders oluşturuldu!</p>',
                confirmButtonText: 'Tamam',
            }).then(() => {
                // Yönlendirme işlemi
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
            title: 'Kayıt Başarısız!',
            text: error.message || 'Lütfen bilgilerinizi kontrol edin.',
            confirmButtonText: 'Tamam',
        }).then(() => {
            // Yönlendirme işlemi
            window.location.href = '/profile'; // Hedef sayfanın URL'sini buraya ekleyin
        });
    }
}

document.getElementById('addCourse').addEventListener('submit', async (event) => {
    event.preventDefault();
    await addCourse();
});
