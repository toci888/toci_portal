// Przykładowy kontekst użytkownika
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      // Sending login data to the API
      const response = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();

        // Save user context to sessionStorage
        sessionStorage.setItem('userContext', JSON.stringify(data));

        alert('Login successful!');
        console.log('User data:', data);
      } else {
        const error = await response.json();
        alert('Error: ' + error.message);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Something went wrong!');
    }
  });



  // Pobieranie danych z sessionStorage
// const savedContext = sessionStorage.getItem("userContext");

// if (savedContext) {
//   const user = JSON.parse(savedContext);
//   console.log("User context retrieved:", user);
// } else {
//   console.log("No user context found in sessionStorage.");
// }