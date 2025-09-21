document.addEventListener('DOMContentLoaded', () => {
  // -----------------------------------------------------------------------
  // Enhanced mobile navigation toggle
  //
  // The navigation drawer opens and closes reliably when tapping the
  // hamburger button. It also closes when a user selects a navigation link,
  // taps outside the menu on the overlay, or presses the Escape key. While
  // open, the page body cannot scroll. The overlay dims the page content
  // underneath, providing a clear focus on the navigation. Aria attributes
  // update to communicate the state of the menu for assistive technologies.
  // -----------------------------------------------------------------------
  const navToggleBtn = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.site-nav');
  const body = document.body;
  // Create a single overlay element once
  const navOverlay = document.createElement('div');
  navOverlay.className = 'nav-overlay';
  document.body.appendChild(navOverlay);

  /** Close the navigation drawer and clean up state */
  function closeNav() {
    if (!navMenu.classList.contains('open')) return;
    navMenu.classList.remove('open');
    navToggleBtn.setAttribute('aria-expanded', 'false');
    navOverlay.classList.remove('active');
    body.classList.remove('no-scroll');
    // Remove overlay click and Escape handlers
    navOverlay.removeEventListener('click', closeNav);
    document.removeEventListener('keydown', escHandler);
    // Return focus to toggle button for accessibility
    navToggleBtn.focus();
  }

  /** Escape key handler for closing nav */
  function escHandler(e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
      closeNav();
    }
  }

  /** Open the navigation drawer and set up handlers */
  function openNav() {
    if (navMenu.classList.contains('open')) return;
    navMenu.classList.add('open');
    navToggleBtn.setAttribute('aria-expanded', 'true');
    navOverlay.classList.add('active');
    body.classList.add('no-scroll');
    // Listen for outside clicks and Escape key
    navOverlay.addEventListener('click', closeNav);
    document.addEventListener('keydown', escHandler);
    // For screen readers, mark the menu as visible
    navMenu.setAttribute('aria-hidden', 'false');
  }

  if (navToggleBtn && navMenu) {
    // Initialise aria attributes
    navToggleBtn.setAttribute('aria-expanded', 'false');
    navMenu.setAttribute('aria-hidden', 'true');

    navToggleBtn.addEventListener('click', () => {
      const isExpanded = navToggleBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeNav();
      } else {
        openNav();
      }
    });
    // Close menu when a link inside it is clicked
    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        closeNav();
      });
    });
  }

  // Populate speakers preview on index
  const speakersPreview = document.getElementById('speakers-preview');
  if (speakersPreview) {
    fetch('/api/speakers')
      .then((res) => res.json())
      .then((speakers) => {
        const limited = speakers.slice(0, 3);
        limited.forEach((sp) => {
          const card = document.createElement('div');
          card.className = 'speaker-card card';
          card.innerHTML = `
            <img src="assets/${sp.image}" alt="${sp.name}">
            <div class="card-body">
              <h3>${sp.name}</h3>
              <p><strong>${sp.title}</strong></p>
              <p>${sp.affiliation}</p>
            </div>
          `;
          speakersPreview.appendChild(card);
        });
      })
      .catch((err) => {
        console.error('Error loading speakers:', err);
      });
  }

  // Populate sponsors preview on index
  const sponsorsPreview = document.getElementById('sponsors-preview');
  if (sponsorsPreview) {
    fetch('/api/sponsors')
      .then((res) => res.json())
      .then((sponsors) => {
        sponsors.forEach((sp) => {
          const div = document.createElement('div');
          div.className = 'sponsor-item card';
          div.innerHTML = `
            <img src="assets/${sp.logo}" alt="${sp.name}">
            <div class="card-body">
              <h4>${sp.name}</h4>
              <p>${sp.tier}</p>
            </div>
          `;
          sponsorsPreview.appendChild(div);
        });
      })
      .catch((err) => {
        console.error('Error loading sponsors:', err);
      });
  }
});