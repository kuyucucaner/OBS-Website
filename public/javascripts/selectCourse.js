document.querySelectorAll('[id^="enrollForm_"]').forEach(form => {
    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        function getCookie(name) {
            const cookies = document.cookie.split(';');
            for (const cookie of cookies) {
                const [cookieName, cookieValue] = cookie.trim().split('=');
                if (cookieName === name) {
                    return cookieValue;
                }
            }
            return null;
        }

        const userId = getCookie('id');

        if (!userId) {
            console.error('User ID not found in the cookie.');
            Swal.fire({
                icon: 'error',
                title: 'An error occurred',
                text: 'User ID not found.'
            });
            return;
        }

        const formData = new FormData(this);
        const course = formData.get('course');
        console.log('Course Value:', course);

        try {
            const response = await fetch(`/selectCourse/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ course: course }),
            });

            if (response.ok) {
                const result = await response.json();
                Swal.fire({
                    icon: 'success',
                    title: 'İşlem başarılı!',
                    text: result.success
                });
            } else {
                const result = await response.json();
                Swal.fire({
                    icon: 'error',
                    title: 'İşlem Başarısız!',
                    text: result.error
                });
            }
        } catch (error) {
            console.error('Hata:', error);
            Swal.fire({
                icon: 'error',
                title: 'An error occurred',
                text: 'An error occurred.'
            });        }
    });
});
