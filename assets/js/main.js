// JavaScript functionality for navigation and language toggle
document.addEventListener('DOMContentLoaded', function () {
  var menuToggle = document.getElementById('menuToggle');
  var nav = document.getElementById('nav');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  // Close mobile menu when clicking on a nav link
  var navLinks = document.querySelectorAll('#nav a');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (nav && nav.classList.contains('open')) {
        nav.classList.remove('open');
      }
    });
  });

  // Language toggle
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.addEventListener('click', function () {
      var target = langToggle.getAttribute('data-translation');
      if (target) {
        window.location.href = target;
      }
    });
  }
});