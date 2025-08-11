document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('schedule-container');
  if (!container) return;
  // Load the same schedule data used for the English site
  fetch('../data/schedule.json')
    .then((res) => res.json())
    .then((days) => {
      days.forEach((day) => {
        const dayNameMap = {
          'Summit Day': 'Día de la Cumbre',
        };
        const dayName = dayNameMap[day.day] || day.day;
        const dayDiv = document.createElement('div');
        dayDiv.className = 'schedule-day';
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
      console.error('Error al cargar el programa:', err);
    });
});

/**
 * Convierte una cadena de fecha ISO (YYYY-MM-DD) a un formato legible en español.
 *
 * Cuando se pasa una cadena YYYY-MM-DD simple al constructor de Date, el valor
 * se interpreta como UTC. Para evitar un desfase de un día en zonas horarias
 * detrás de UTC, agregamos una porción de hora (T00:00:00) para que la fecha se
 * analice en la zona horaria local.
 *
 * @param {string} dateStr Cadena de fecha ISO (YYYY-MM-DD)
 * @returns {string} Fecha formateada, por ejemplo "16 de mayo de 2026"
 */
function formatDate(dateStr) {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}