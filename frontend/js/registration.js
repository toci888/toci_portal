document.getElementById('registrationForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Simple password confirmation check
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Prepare the data to send
    const userData = {
      username,
      email,
      password
    };

    try {
      // Send the data to the backend
        console.log(userData);
       //window.location.href = '/login.html';
      const response = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        alert('User registered successfully!');

        window.location.href = '/login.html';

        console.log('href');
      } else {
        const error = await response.json();
        alert('Error: ' + error.message);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Something went wrong!j');
    }
  });