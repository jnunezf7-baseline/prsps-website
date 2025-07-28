document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('sponsor-list');
  if (!list) return;
  fetch('/api/sponsors')
    .then((res) => res.json())
    .then((sponsors) => {
      // Group sponsors by tier
      const tiers = {};
      sponsors.forEach((sp) => {
        if (!tiers[sp.tier]) tiers[sp.tier] = [];
        tiers[sp.tier].push(sp);
      });
      Object.keys(tiers).forEach((tier) => {
        const section = document.createElement('div');
        section.className = 'sponsor-tier';
        // heading for tier
        const heading = document.createElement('h2');
        heading.className = 'section-heading';
        heading.textContent = tier;
        section.appendChild(heading);
        const row = document.createElement('div');
        row.className = 'card-grid';
        tiers[tier].forEach((sp) => {
          const item = document.createElement('div');
          item.className = 'sponsor-item card';
          item.innerHTML = `
            <img src="assets/${sp.logo}" alt="${sp.name}">
            <div class="card-body">
              <h4>${sp.name}</h4>
            </div>
          `;
          row.appendChild(item);
        });
        section.appendChild(row);
        list.appendChild(section);
      });
    })
    .catch((err) => {
      console.error('Error loading sponsors:', err);
    });
});