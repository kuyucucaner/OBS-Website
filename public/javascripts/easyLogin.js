// Giriş sayfasında çerez kontrolü ve otomatik doldurma
window.addEventListener('DOMContentLoaded', (event) => {
    const rememberedStudentNo = getCookie('rememberedStudentNo');
    const rememberedPassword = getCookie('rememberedPassword');
    const studentNoInput = document.getElementById('studentNo');
    const passwordInput = document.getElementById('password');
    const rememberMeCheckbox = document.getElementById('rememberMe');

    if (rememberedStudentNo && rememberedPassword) {
        document.getElementById('studentNo').value = rememberedStudentNo;
        document.getElementById('password').value = rememberedPassword;
        rememberMeCheckbox.checked = true;
        changeInputColor(studentNoInput, 'lightgreen'); // Renk değiştirme fonksiyonu
        changeInputColor(passwordInput, 'lightgreen');  // Renk değiştirme fonksiyonu
    }
});

// Çerez alma fonksiyonu
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
function changeInputColor(inputElement, color) {
    inputElement.style.backgroundColor = color;
}