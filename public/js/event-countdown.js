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
   * Shows days remaining until the event date. Uses a sports‑inspired phrase
   * for branding and removes sub‑day precision. If the event is today or passed,
   * displays an appropriate message.
   */
  function updateCountdown() {
    const countdownEl = document.getElementById('event-countdown');
    if (!countdownEl) return;
    const now = nowInTimeZone();
    const msPerDay = 24 * 60 * 60 * 1000;
    const diffMs = EVENT_DATE - now;
    if (diffMs <= 0) {
      countdownEl.textContent = 'Game day! The summit is happening today.';
      return;
    }
    // Round up to the nearest day so partial days count as a full day
    const days = Math.ceil(diffMs / msPerDay);
    let message;
    if (days > 1) {
      message = `Countdown to kickoff: ${days} days until the summit`;
    } else {
      message = 'Countdown to kickoff: 1 day until the summit';
    }
    countdownEl.textContent = message;
  }

  // Initial call and set interval
  updateCountdown();
  setInterval(updateCountdown, 60 * 1000);
})();