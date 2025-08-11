// Spanish schedule script for PRSPS
//
// This file mirrors the functionality of schedule.js but renders
// headings and dates in Spanish. It also translates the name of
// each event day (e.g. "Summit Day" → "Día de la Cumbre") and
// table headers. See schedule.js for the English version.

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('schedule-container');
  if (!container) return;
  // Load the existing schedule JSON. The times remain the same
  // across languages so no additional data file is needed.
  fetch('data/schedule.json')
    .then((res) => res.json())
    .then((days) => {
      days.forEach((day) => {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'schedule-day';
        const dayName = translateDay(day.day);
        dayDiv.innerHTML = `<h3>${dayName} – ${formatDate(day.date)}</h3>`;

        const table = document.createElement('table');
        table.className = 'schedule-table';
        table.innerHTML = `
          <thead>
            <tr>
              <th>Hora</th>
              <th>Sesión</th>
              <th>Ponente</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody></tbody>
        `;
        const tbody = table.querySelector('tbody');
        day.sessions.forEach((session) => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${session.time}</td>
            <td>${session.title}</td>
            <td>${session.speaker || ''}</td>
            <td>${session.description || ''}</td>
          `;
          tbody.appendChild(tr);
        });
        dayDiv.appendChild(table);
        container.appendChild(dayDiv);
      });
    })
    .catch((err) => {
      console.error('Error loading schedule:', err);
    });
});

/**
 * Translate the English day name into Spanish. If no translation
 * exists, return the original value.
 *
 * @param {string} day
 * @returns {string}
 */
function translateDay(day) {
  const mapping = {
    'Summit Day': 'Día de la Cumbre',
  };
  return mapping[day] || day;
}

/**
 * Format an ISO date string (YYYY-MM-DD) into a Spanish date
 * representation. We append a midnight time to ensure the date
 * is parsed in the local time zone (see schedule.js for details).
 *
 * @param {string} dateStr
 * @returns {string}
 */
function formatDate(dateStr) {
  const date = new Date(`${dateStr}T00:00:00`);
  // Use the Puerto Rico Spanish locale so month and day names appear in Spanish.
  return date.toLocaleDateString('es-PR', { month: 'long', day: 'numeric', year: 'numeric' });
}