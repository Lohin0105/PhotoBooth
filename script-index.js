document.addEventListener('DOMContentLoaded', () => {
  // Redirect to main.html if already logged in
  if (localStorage.getItem('isLoggedIn') === 'true') {
    window.location.href = 'main.html';
  }

  // Get form elements
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const loginBtn = document.getElementById('loginBtn');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const showRegister = document.getElementById('showRegister');
  const showLogin = document.getElementById('showLogin');
  const registerBtn = document.getElementById('registerBtn');
  const regUsername = document.getElementById('regUsername');
  const regPassword = document.getElementById('regPassword');
  const regConfirmPassword = document.getElementById('regConfirmPassword');

  // Toggle to registration form
  showRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
  });

  // Toggle to login form
  if (showLogin) {
    showLogin.addEventListener('click', (e) => {
      e.preventDefault();
      registerForm.style.display = 'none';
      loginForm.style.display = 'block';
    });
  }

  // Login event
  loginBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    if (!username || !password) {
      alert('Please enter valid credentials.');
      return;
    }
    // Retrieve registered users from localStorage (stored as an object)
    let users = JSON.parse(localStorage.getItem('users')) || {};
    if (users[username] && users[username] === password) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', username);
      window.location.href = 'main.html';
    } else {
      alert('Invalid username or password.');
    }
  });

  // Registration event
  registerBtn.addEventListener('click', () => {
    const username = regUsername.value.trim();
    const password = regPassword.value.trim();
    const confirmPassword = regConfirmPassword.value.trim();
    if (!username || !password || !confirmPassword) {
      alert('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    let users = JSON.parse(localStorage.getItem('users')) || {};
    if (users[username]) {
      alert('Username already exists.');
      return;
    }
    // Register the new user
    users[username] = password;
    localStorage.setItem('users', JSON.stringify(users));
    alert('Registration successful! You can now log in.');
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
  });
});
