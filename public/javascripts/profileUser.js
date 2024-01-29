document.addEventListener('DOMContentLoaded', function () {

    fetch('/profile-user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Response Data:', data);
      })
      .catch(error => {
        console.error('Fetch Error:', error);
      });
  });
  