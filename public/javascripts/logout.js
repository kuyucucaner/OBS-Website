function logout() {
    fetch('/logout', {
        method: 'POST',
        credentials: 'include', // Gerekirse, cookie'leri göndermek için
    })
    .then(response => {
        if (response.ok) {
            return response.text();
        }
        throw new Error('Çıkış işlemi başarısız oldu.');
    })
    .then(data => {
        console.log(data);
        Swal.fire({
            icon: 'success',
            title: 'Çıkış Başarılı',
            text: 'Başarıyla çıkış yaptınız.',
        }).then(() => {
            window.location.href = '/'; // Çıkış yapıldıktan sonra anasayfaya yönlendir
        });
    })
    .catch(error => {
        console.error(error.message);
        Swal.fire({
            icon: 'error',
            title: 'Hata!',
            text: 'Çıkış işlemi başarısız oldu.',
        });
    });
}
