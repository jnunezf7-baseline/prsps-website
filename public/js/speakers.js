document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('speakers-grid');
  if (!grid) return;
  // For static deployments, load speaker data from the data folder rather than a server API.
  fetch('data/speakers.json')
    .then((res) => res.json())
    .then((speakers) => {
      const biosContainer = document.getElementById('bios-container');
      speakers.forEach((sp) => {
        // create slug for anchor links
        const slug = sp.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        // create card as link
        const link = document.createElement('a');
        link.href = `#bio-${slug}`;
        link.className = 'speaker-card card';
        link.innerHTML = `
          <img src="assets/${sp.image}" alt="${sp.name}">
          <div class="card-body">
            <h3>${sp.name}</h3>
            <p><strong>${sp.title}</strong></p>
            <p>${sp.affiliation}</p>
            <p><em>${sp.topic}</em></p>
          </div>
        `;
        grid.appendChild(link);
        // create biography section
        if (biosContainer) {
          const bioSection = document.createElement('section');
          bioSection.id = `bio-${slug}`;
          bioSection.className = 'speaker-bio';
          bioSection.innerHTML = `
            <h3>${sp.name}</h3>
            <p><strong>${sp.title}</strong> &ndash; ${sp.affiliation}</p>
            <p>${sp.bio}</p>
          `;
          biosContainer.appendChild(bioSection);
        }
      });
    })
    .catch((err) => {
      console.error('Error loading speakers:', err);
    });
});