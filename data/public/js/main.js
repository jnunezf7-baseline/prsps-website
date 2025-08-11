document.addEventListener('DOMContentLoaded', () => {
  // Mobile navigation toggle
  const navToggle = document.getElementById('nav-toggle');
  const siteNav = document.getElementById('site-nav');
  if (navToggle && siteNav) {
    // Toggle the off‑canvas navigation when the hamburger icon is clicked
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      siteNav.classList.toggle('open');
    });
    // Close the menu when a nav link is clicked (useful on mobile)
    const navLinks = siteNav.querySelectorAll('a');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        siteNav.classList.remove('open');
      });
    });
    // Close the menu when clicking anywhere outside of the nav on mobile
    document.body.addEventListener('click', (ev) => {
      // If menu is open and the click target is not inside the nav or the toggle button, close it
      if (siteNav.classList.contains('open')) {
        const isClickInsideNav = siteNav.contains(ev.target) || navToggle.contains(ev.target);
        if (!isClickInsideNav) {
          siteNav.classList.remove('open');
        }
      }
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