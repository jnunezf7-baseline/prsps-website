/*
 * Event countdown script
 *
 * This module inserts a countdown message into the header of the
 * website showing how many days remain until the Puerto Rico Sports
 * Performance Summit on May 16, 2026. It uses the America/Puerto_Rico
 * time zone (AST) for calculations to ensure the countdown is
 * consistent regardless of the visitor’s local time zone. The
 * countdown updates every minute.
 */

(function () {
  'use strict';

  // Define the event start date/time in AST (UTC‑4). We choose
  // midnight (00:00) on May 16, 2026 since the summit runs all day.
  const EVENT_DATE = new Date('2026-05-16T00:00:00-04:00');

  // Puerto Rico offset from UTC in minutes (AST is UTC‑4)
  const PR_OFFSET_MINUTES = 4 * 60;

  /**
   * Returns the current time in milliseconds adjusted to the
   * America/Puerto_Rico time zone. This function accounts for the
   * difference between the browser’s local time zone and AST.
   */
  function getNowAstMs() {
    const nowMs = Date.now();
    const localOffset = new Date().getTimezoneOffset();
    // Convert to AST by accounting for the difference between the local
    // offset and Puerto Rico's fixed offset (‑04:00 = 240 minutes).
    return nowMs + (localOffset - PR_OFFSET_MINUTES) * 60 * 1000;
  }

  /**
   * Formats the countdown message. When the difference is more than
   * one day, it is expressed in whole days. When less than a day
   * remains, hours and minutes are shown. If the event is today or
   * has passed, an appropriate message is returned.
   *
   * @param {number} diffMs Time difference in milliseconds (event time minus now)
   * @returns {string} The formatted countdown message
   */
  function formatEventCountdown(diffMs) {
    // If event is in the past or happening now
    if (diffMs <= 0) {
      return 'The event is happening today!';
    }
    const totalMinutes = Math.floor(diffMs / (60 * 1000));
    const totalHours = Math.floor(totalMinutes / 60);
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;
    if (days > 0) {
      // Show only days when more than a day remains
      return `The event will be in ${days} day${days === 1 ? '' : 's'}`;
    }
    if (hours > 0) {
      return `The event will be in ${hours} hour${hours === 1 ? '' : 's'} and ${minutes} minute${minutes === 1 ? '' : 's'}`;
    }
    return `The event will be in ${minutes} minute${minutes === 1 ? '' : 's'}`;
  }

  /**
   * Updates the header countdown element with the remaining time.
   */
  function updateEventCountdown() {
    const countdownEl = document.getElementById('event-countdown');
    if (!countdownEl) return;
    const nowAstMs = getNowAstMs();
    const diffMs = EVENT_DATE.getTime() - nowAstMs;
    countdownEl.textContent = formatEventCountdown(diffMs);
  }

  // Initialize after DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    updateEventCountdown();
    // Update every minute
    setInterval(updateEventCountdown, 60 * 1000);
  });
})();