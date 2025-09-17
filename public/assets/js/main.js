// PRSPS site JavaScript

// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', function () {
  const menuIcon = document.querySelector('.mobile-menu-icon');
  const nav = document.querySelector('nav');
  if (menuIcon && nav) {
    menuIcon.addEventListener('click', () => {
      nav.classList.toggle('active');
    });
  }

  // Countdown timer for event date
  const countdownEl = document.getElementById('countdown');
  if (countdownEl) {
    // Set event date (May 16, 2026 at 9:00 AM AST)
    const eventDate = new Date('2026-05-16T13:00:00Z'); // 9:00 AST equals 13:00 UTC
    const updateCountdown = () => {
      const now = new Date();
      const diff = eventDate - now;
      if (diff <= 0) {
        countdownEl.textContent = 'The event is underway!';
        clearInterval(interval);
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      countdownEl.textContent = `Countdown: ${days}d ${hours}h ${minutes}m ${seconds}s`;
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
  }
});