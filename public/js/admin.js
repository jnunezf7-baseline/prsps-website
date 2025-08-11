document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('admin-login-form');
  const attendeesContainer = document.getElementById('attendees-container');
  const attendeesTableBody = document.querySelector('#attendees-table tbody');
  if (!loginForm) return;
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const passwordInput = document.getElementById('admin-password');
    const password = passwordInput.value;
    // Basic password check – replace with a secure authentication mechanism
    const ADMIN_PASSWORD = window.ADMIN_PASSWORD || 'admin123';
    if (password === ADMIN_PASSWORD) {
      // Hide login form
      loginForm.hidden = true;
      // Show attendees container
      attendeesContainer.hidden = false;
      // Fetch attendees
      try {
        const res = await fetch('/api/attendees');
        const attendees = await res.json();
        attendeesTableBody.innerHTML = '';
        attendees.forEach((att) => {
          const tr = document.createElement('tr');
          // Format guest names as comma-separated string
          const guests = Array.isArray(att.guestNames) && att.guestNames.length > 0 ? att.guestNames.join(', ') : '-';
          // Map day codes to human-readable event names
          let eventName;
          switch (att.daysAttending) {
            case 'day1':
              eventName = 'Day 1';
              break;
            case 'day2':
              eventName = 'Day 2';
              break;
            case 'both':
              eventName = 'Both Days';
              break;
            default:
              eventName = att.daysAttending || '-';
          }
          tr.innerHTML = `
            <td>${att.name}</td>
            <td>${att.email}</td>
            <td>${att.phone}</td>
            <td>${att.profession || '-'}</td>
            <td>${eventName}</td>
            <td>${att.ticketType || '-'}</td>
            <td>${att.quantity || 1}</td>
            <td>${att.travelType || '-'}</td>
            <td>${guests}</td>
            <td>${att.transactionId || '-'}</td>
            <td>${att.date ? new Date(att.date).toLocaleString() : '-'}</td>
          `;
          attendeesTableBody.appendChild(tr);
        });
      } catch (err) {
        console.error('Error fetching attendees:', err);
      }
    } else {
      alert('Incorrect password.');
      passwordInput.value = '';
    }
  });
});