document.addEventListener('DOMContentLoaded', () => {
  // Mobile navigation toggle
  const navToggle = document.getElementById('nav-toggle');
  const siteNav = document.getElementById('site-nav');
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      // Toggle the open class on the navigation to slide it in/out on mobile
      const isOpen = siteNav.classList.toggle('open');
      // Update the aria-label so screen reader users know if the menu will open or close
      navToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
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