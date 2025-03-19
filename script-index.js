let isRegistering = false;

// Splash screen timeout
setTimeout(() => {
  document.getElementById("splashScreen").style.opacity = '0';
  setTimeout(() => {
    document.getElementById("splashScreen").style.display = 'none';
    document.getElementById("authContainer").style.display = 'block';
  }, 500);
}, 3000);

// Initialize localStorage for user data
window.addEventListener('load', () => {
  if (localStorage.getItem('users') === null) {
    localStorage.setItem('users', JSON.stringify({}));
  }
});

// Function to handle form switch (login <--> register)
function updateAuthForm() {
  const authContainer = document.getElementById("authContainer");
  const form = document.getElementById("authForm");
  const errorMessage = document.getElementById("errorMessage");

  // Remove previous event listeners to prevent duplication
  form.innerHTML = "";

  if (isRegistering) {
    authContainer.querySelector("h2").textContent = "Register";
    form.innerHTML = `
      <input type="text" id="newUsername" placeholder="Username" required>
      <input type="password" id="newPassword" placeholder="Password" required>
      <button type="submit">Register</button>
      <p id="switchToLogin">Already have an account? <span class="link">Login</span></p>
    `;
  } else {
    authContainer.querySelector("h2").textContent = "Login";
    form.innerHTML = `
      <input type="text" id="username" placeholder="Username" required>
      <input type="password" id="password" placeholder="Password" required>
      <button type="submit">Login</button>
      <p id="switchToRegister">Don't have an account? <span class="link">Register</span></p>
    `;
  }

  errorMessage.textContent = "";

  // Add new event listeners
  document.getElementById("switchToRegister")?.addEventListener("click", () => {
    isRegistering = true;
    updateAuthForm();
  });

  document.getElementById("switchToLogin")?.addEventListener("click", () => {
    isRegistering = false;
    updateAuthForm();
  });

  document.getElementById("authForm").addEventListener("submit", handleAuthSubmit);
}

// Handle form submission
function handleAuthSubmit(e) {
  e.preventDefault();

  const users = JSON.parse(localStorage.getItem('users'));

  if (isRegistering) {
    const username = document.getElementById("newUsername").value.trim();
    const password = document.getElementById("newPassword").value.trim();

    if (!users[username]) {
      users[username] = { password };
      localStorage.setItem('users', JSON.stringify(users));
      alert("Registration successful! Please login.");
      isRegistering = false;
      updateAuthForm();
    } else {
      document.getElementById("errorMessage").textContent = "Username already exists!";
    }
  } else {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (users[username] && users[username].password === password) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("currentUser", username);
      window.location.href = "main.html"; // Redirect to main page
    } else {
      document.getElementById("errorMessage").textContent = "Invalid username or password!";
    }
  }
}

// Initial form setup
updateAuthForm();
