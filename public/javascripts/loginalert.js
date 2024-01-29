async function validateStudentNo() {
    const studentNoInput = document.getElementById('studentNo');
    const passwordInput = document.getElementById('password');
    const rememberMeCheckbox = document.getElementById('rememberMe');

    const studentNo = studentNoInput.value;
    const password = passwordInput.value;
    const rememberMe = rememberMeCheckbox.checked ? 'on' : null;

    // Örnek: Öğrenci numarasının bir sayı olup olmadığını kontrol etme
    if (!/^\d+$/.test(studentNo)) {
        Swal.fire({
            icon: 'error',
            title: 'Hatalı Giriş',
            text: 'Öğrenci Numarası sadece rakamlardan oluşmalıdır.',
            confirmButtonText: 'Tamam',
        });
        return;
    }

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ studentNo, password, rememberMe }),
        });

        if (response.ok) {
            // Başarılı giriş durumunda yönlendirme
            Swal.fire({
                icon: 'success',
                title: 'Başarılı Giriş!',
                html: `<p>Hoş Geldiniz!</p>`,
                confirmButtonText: 'Tamam',
            }).then(() => {
                // Yönlendirme işlemi
                window.location.href = '/home'; // Hedef sayfanın URL'sini buraya ekleyin
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
            title: 'Giriş Başarısız!',
            text: error.message || 'Lütfen bilgilerinizi kontrol edin.',
            confirmButtonText: 'Tamam',
        }).then(() => {
            // Yönlendirme işlemi
            window.location.href = '/'; // Hedef sayfanın URL'sini buraya ekleyin
        });
    }
}

document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    await validateStudentNo();
});