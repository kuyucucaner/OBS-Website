function saveNote(studentId, courseId) {
    var noteInput = document.querySelector(`input[name="note_${studentId}_${courseId}"]`);
    var noteValue = noteInput.value;

    // Girişi kontrol et ve gerekli sınırlamaları uygula
    if (isNaN(noteValue) || noteValue < 0 || noteValue > 100) {
        Swal.fire({
            title: 'Hata!',
            text: 'Geçersiz not değeri. Not değeri 0 ile 100 arasında olmalıdır.',
            icon: 'error',
        });
        return;
    }

    console.log('Student ID  : ' , studentId , 'Course ID : ' , courseId);

    fetch('/add-note', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            StudentID: studentId,
            CourseID: courseId,
            Note: noteValue,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                title: 'Başarılı!',
                text: 'Not başarıyla güncellendi.',
                icon: 'success',
            })
            .then(() => {
                window.location.reload();
            });
        } else {
            Swal.fire({
                title: 'Hata!',
                text: 'Not güncellenirken bir hata oluştu.',
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
