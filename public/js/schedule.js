document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('schedule-container');
  if (!container) return;
  fetch('/api/schedule')
    .then((res) => res.json())
    .then((days) => {
      days.forEach((day) => {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'schedule-day';
        dayDiv.innerHTML = `<h3>${day.day} – ${formatDate(day.date)}</h3>`;
        const table = document.createElement('table');
        table.className = 'schedule-table';
        table.innerHTML = `
          <thead>
            <tr>
              <th>Time</th>
              <th>Session</th>
              <th>Speaker</th>
              <th>Description</th>
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
 * Formats an ISO date string (YYYY-MM-DD) into a human‑readable format.
 *
 * When a plain YYYY-MM-DD string is passed into the Date constructor, the value
 * is interpreted as UTC. This can cause the date to appear one day earlier
 * when formatted in a time zone behind UTC (e.g. AST/EST). To avoid this
 * off‑by‑one issue, we append a time portion (T00:00:00) so that the date is
 * parsed in the local time zone. See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date#parameters
 *
 * @param {string} dateStr ISO date string (YYYY-MM-DD)
 * @returns {string} Formatted date like "May 15, 2026"
 */
function formatDate(dateStr) {
  // Append a midnight time so the date is created in the local time zone
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}