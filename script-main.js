document.addEventListener('DOMContentLoaded', () => {
  // Redirect to login if not authenticated
  if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'index.html';
  }

  // ===== HAMBURGER MENU TOGGLE =====
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navLinks = document.getElementById('navLinks');

  hamburgerBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  // ===== NAVIGATION LINKS =====
  document.getElementById('homeLink').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'main.html';
  });

  document.getElementById('recentLink').addEventListener('click', (e) => {
    e.preventDefault();
    alert('Recent Pics clicked!');
  });

  document.getElementById('logoutLink').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    window.location.href = 'index.html';
  });

  // ===== ACTION BUTTONS =====
  document.getElementById('takePicBtn').addEventListener('click', () => {
    window.location.href = 'takepicture.html';
  });

  document.getElementById('uploadPicBtn').addEventListener('click', () => {
    window.location.href = 'uploadpicture.html';
  });
});
