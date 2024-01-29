async function updateChanges() {
    const studentNo = parseInt(document.getElementById('studentNoValue').innerText, 10);
    const addressElement = document.getElementById('address');
    const addressValue = addressElement ? addressElement.value : document.getElementById('addressValue').innerText;
    const phoneElement = document.getElementById('phoneNumber');
    const phoneValue = phoneElement ? phoneElement.value : document.getElementById('phoneNumberValue').innerText;
    const emergencyPhoneNumberElement = document.getElementById('emergencyPhoneNumber');
    const emergencyPhoneNumberValue = emergencyPhoneNumberElement ? emergencyPhoneNumberElement.value : document.getElementById('addrephoneNumberValuessValue').innerText;
   
    console.log('user.address:', '<%= user.address %>');
    console.log('studentNo: ', studentNo);
    console.log('addressElement: ', addressElement);
    console.log('addressValue: ', addressValue);
    console.log('phoneElement: ', phoneElement);
    console.log('phoneValue: ', phoneValue);
    console.log('emergencyPhoneNumberElement: ', emergencyPhoneNumberElement);
    console.log('emergencyPhoneNumberValue: ', emergencyPhoneNumberValue);
    await fetch('/update-profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            studentNo: studentNo,
            address: addressValue,
            phoneNumber: phoneValue,
            emergencyPhoneNumber: emergencyPhoneNumberValue,
        }),        
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                title: 'Başarılı!',
                text: 'Profil başarıyla güncellendi.',
                icon: 'success',
            })
            .then(() => {
                window.location.reload();
            });
        } else {
            Swal.fire({
                title: 'Hata!',
                text: 'Profil güncellenirken bir hata oluştu.',
                icon: 'error',
            }).then(() => {
                window.location.reload();
            });
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        Swal.fire({
            title: 'Hata!',
            text: 'Bir şeyler yanlış gitti.',
            icon: 'error',
        });
    });
}
function updateProfileInfo(newAddress, newPhoneNumber, newEmergencyPhoneNumber) {
    const addressElement = document.getElementById('addressValue');
    const phoneNumberElement = document.getElementById('phoneNumberValue');
    const emergencyPhoneNumberElement = document.getElementById('emergencyPhoneNumberValue');
  
    if (addressElement) {
      addressElement.innerText = newAddress;
    }
  
    if (phoneNumberElement) {
      phoneNumberElement.innerText = newPhoneNumber;
    }
  
    if (emergencyPhoneNumberElement) {
      emergencyPhoneNumberElement.innerText = newEmergencyPhoneNumber;
    }
}
  