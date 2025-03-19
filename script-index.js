let isRegistering = false;

// Splash screen timeout
setTimeout(() => {
  document.getElementById("splashScreen").style.opacity = '0';
  setTimeout(() => {
    document.getElementById("splashScreen").style.display = 'none';
    document.getElementById("authContainer").style.display = 'block';
  }, 500);
}, 3000);

// Event listeners
document.getElementById("switchToRegister").addEventListener("click", function (e) {
  e.preventDefault();
  isRegistering = true;
  updateAuthForm();
});

document.getElementById("authForm").addEventListener("submit", function (e) {
  e.preventDefault();
  handleAuthSubmit();
});

// Functions
function updateAuthForm() {
  const authContainer = document.getElementById("authContainer");
  const form = document.getElementById("authForm");
  const errorMessage = document.getElementById("errorMessage");

  if (isRegistering) {
    authContainer.querySelector("h2").textContent = "Register";
    form.innerHTML = `
      <input type="text" id="newUsername" placeholder="Username" required>
      <input type="password" id="newPassword" placeholder="Password" required>
      <button type="submit">Register</button>
    `;
    document.getElementById("switchToRegister").textContent = "Already have an account? Login";
  } else {
    authContainer.querySelector("h2").textContent = "Login";
    form.innerHTML = `
      <input type="text" id="username" placeholder="Username" required>
      <input type="password" id="password" placeholder="Password" required>
      <button type="submit">Login</button>
    `;
    document.getElementById("switchToRegister").textContent = "Don't have an account? Register";
  }
  errorMessage.textContent = "";
}

function handleAuthSubmit() {
  if (isRegistering) {
    const username = document.getElementById("newUsername").value;
    const password = document.getElementById("newPassword").value;

    if (!localStorage.getItem(username)) {
      localStorage.setItem(username, JSON.stringify({ username, password }));
      alert("Registration successful! You can now login.");
      isRegistering = false;
      updateAuthForm();
    } else {
      document.getElementById("errorMessage").textContent = "Username already exists!";
    }
  } else {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const userData = localStorage.getItem(username);

    if (userData) {
      const storedUser = JSON.parse(userData);
      if (storedUser.password === password) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", username);
        window.location.href = "main.html";
      } else {
        document.getElementById("errorMessage").textContent = "Incorrect password!";
      }
    } else {
      document.getElementById("errorMessage").textContent = "Username not found!";
    }
  }
}
