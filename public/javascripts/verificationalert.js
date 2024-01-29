async function validateStudentNo() {
    const studentNo = document.getElementById('studentNo').value;
    const verificationCode = document.getElementById('verificationCode').value;

    try {
        const response = await fetch('/verification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ studentNo, verificationCode }),
        });

        if (response.ok) {
            // Başarılı giriş durumunda yönlendirme
            Swal.fire({
                icon: 'success',
                title: 'Kullanıcı Onaylandı!',
                html: `<p>Hoş Geldiniz!</p>`,
                confirmButtonText: 'Tamam',
            }).then(() => {
                // Yönlendirme işlemi
                window.location.href = '/'; // Hedef sayfanın URL'sini buraya ekleyin
            });
        } else {
            const statusCode = response.status;
            console.error('Hata Durum Kodu:', statusCode);
            
            const responseBody = await response.json();

            if (statusCode === 401) {
                throw new Error(responseBody.error || 'Geçersiz Öğrenci Numarası');
            } else {
                throw new Error(responseBody.error || `Sunucu Hatası: ${statusCode}`);
            }
        }
    } catch (error) {
        console.error('Hata Yakalandı:', error);
        Swal.fire({
            icon: 'error',
            title: 'Onaylama Başarısız!',
            text: error.message || 'Lütfen bilgilerinizi kontrol edin.',
            confirmButtonText: 'Tamam',
        }).then(() => {
            // Yönlendirme işlemi
            window.location.href = '/verification'; // Hedef sayfanın URL'sini buraya ekleyin
        });
    }
}

document.getElementById('verification-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    await validateStudentNo();
});
