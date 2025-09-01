// Event countdown timer for PRSPS summit
// Computes days, hours, and minutes until May 16, 2026 in the America/Puerto_Rico time zone.

(() => {
  // Target date: May 16, 2026 at 00:00 AST
  // Using UTC base and adjusting via Intl to avoid local timezone issues.
  const EVENT_DATE = new Date(Date.UTC(2026, 4, 16, 0, 0, 0));
  const TIMEZONE = 'America/Puerto_Rico';

  /**
   * Get a Date object representing the current moment in the specified IANA time zone.
   * We format the current time into parts for the target time zone and then reconstruct.
   */
  function nowInTimeZone() {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    const parts = formatter.formatToParts(now).reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});
    return new Date(
      `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`
    );
  }

  /**
   * Update the countdown display every minute.
   */
  function updateCountdown() {
    const countdownEl = document.getElementById('event-countdown');
    if (!countdownEl) return;
    const now = nowInTimeZone();
    let diff = EVENT_DATE - now;
    if (diff <= 0) {
      countdownEl.textContent = 'It\'s go time! The summit is happening today.';
      return;
    }
    const msPerMinute = 60 * 1000;
    const msPerHour = 60 * msPerMinute;
    const msPerDay = 24 * msPerHour;
    const days = Math.floor(diff / msPerDay);
    diff -= days * msPerDay;
    const hours = Math.floor(diff / msPerHour);
    diff -= hours * msPerHour;
    const minutes = Math.floor(diff / msPerMinute);
    let message = 'The event will be in ';
    if (days > 0) {
      message += `${days} day${days === 1 ? '' : 's'}`;
      if (days <= 2) {
        message += `, ${hours} hour${hours === 1 ? '' : 's'}`;
      }
    } else if (hours > 0) {
      message += `${hours} hour${hours === 1 ? '' : 's'}, ${minutes} minute${minutes === 1 ? '' : 's'}`;
    } else {
      message += `${minutes} minute${minutes === 1 ? '' : 's'}`;
    }
    countdownEl.textContent = message;
  }

  // Initial call and set interval
  updateCountdown();
  setInterval(updateCountdown, 60 * 1000);
})();