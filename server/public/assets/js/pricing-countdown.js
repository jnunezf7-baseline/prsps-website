/*
 * Pricing & Deadlines countdown script
 *
 * This module calculates the current ticket price tier and updates the
 * displayed prices and countdown message based on the current date in
 * the America/Puerto_Rico time zone. Prices automatically update when
 * the next tier boundary is reached without requiring a page reload.
 */

(function () {
  'use strict';

  // Configuration: define tier boundaries and associated prices.
  // The `end` property defines the last date (inclusive) when the
  // corresponding prices apply. Dates include an explicit AST offset
  // (‑04:00) to ensure the boundary is evaluated in the
  // America/Puerto_Rico time zone regardless of the user's local time.
  const TIERS = [
    {
      end: '2026-01-31T23:59:59-04:00',
      student: 79.99,
      professional: 129.99,
    },
    {
      end: '2026-03-31T23:59:59-04:00',
      student: 89.99,
      professional: 139.99,
    },
    {
      end: '2026-05-14T23:59:59-04:00',
      student: 95.99,
      professional: 145.99,
    },
    {
      end: '2026-05-15T23:59:59-04:00',
      student: 100.0,
      professional: 150.0,
    },
  ];

  // Define the time zone offset for Puerto Rico in minutes (AST is UTC‑4).
  const PR_OFFSET_MINUTES = 4 * 60;

  /**
   * Converts the current system time to a Date representing the current
   * time in the America/Puerto_Rico time zone. This function adjusts
   * for the difference between the browser's local time zone and AST
   * without relying on the user’s device time zone for comparisons.
   *
   * @returns {number} The current time in milliseconds since the epoch
   *   adjusted to Puerto Rico time.
   */
  function getNowAstMs() {
    const nowMs = Date.now();
    const localOffset = new Date().getTimezoneOffset();
    // Convert to AST by accounting for the difference between the local
    // offset and Puerto Rico's fixed offset (‑04:00 = 240 minutes).
    return nowMs + (localOffset - PR_OFFSET_MINUTES) * 60 * 1000;
  }

  /**
   * Determines the current pricing tier based on the provided time.
   *
   * @param {number} nowAstMs Current time in milliseconds (AST).
   * @returns {object|null} The current tier object or null if after all tiers.
   */
  function getCurrentTier(nowAstMs) {
    for (let i = 0; i < TIERS.length; i++) {
      const boundaryMs = new Date(TIERS[i].end).getTime();
      if (nowAstMs <= boundaryMs) {
        return { tier: TIERS[i], index: i };
      }
    }
    return null;
  }

  /**
   * Returns the Date (ms) of the next boundary after the current tier.
   * If there is no next tier, returns null.
   *
   * @param {number} currentIndex Index of the current tier in TIERS.
   */
  function getNextBoundaryMs(currentIndex) {
    const nextIndex = currentIndex + 1;
    if (nextIndex < TIERS.length) {
      return new Date(TIERS[nextIndex].end).getTime();
    }
    return null;
  }

  /**
   * Formats a price as USD with two decimals.
   *
   * @param {number} amount
   * @returns {string}
   */
  function formatPrice(amount) {
    return `$${amount.toFixed(2)}`;
  }

  /**
   * Formats a countdown in a human‑friendly way. If the difference is
   * greater than 48 hours, it is expressed in days. Otherwise it
   * switches to hours and minutes. When the difference is negative,
   * returns an empty string.
   *
   * @param {number} diffMs Time difference in milliseconds
   * @returns {string}
   */
  function formatCountdown(diffMs) {
    if (diffMs <= 0) return '';
    const totalMinutes = Math.floor(diffMs / (60 * 1000));
    const totalHours = Math.floor(totalMinutes / 60);
    if (totalHours >= 48) {
      const days = Math.ceil(totalHours / 24);
      return `${days} day${days === 1 ? '' : 's'}`;
    }
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0) {
      return `${hours} hour${hours === 1 ? '' : 's'} ${minutes} minute${minutes === 1 ? '' : 's'}`;
    }
    return `${minutes} minute${minutes === 1 ? '' : 's'}`;
  }

  /**
   * Updates the pricing UI elements based on current time.
   */
  function updatePricing() {
    const nowAstMs = getNowAstMs();
    const current = getCurrentTier(nowAstMs);
    const priceStudentEl = document.getElementById('price-student');
    const priceProfessionalEl = document.getElementById('price-professional');
    const countdownContainer = document.getElementById('countdown-container');
    const countdownValueEl = document.getElementById('countdown-value');
    const buyLink = document.getElementById('buy-tickets-link');

    if (!current) {
      // All tiers expired; sales closed
      if (priceStudentEl) priceStudentEl.textContent = '–';
      if (priceProfessionalEl) priceProfessionalEl.textContent = '–';
      if (countdownContainer) {
        countdownContainer.textContent = 'Sales closed';
      }
      if (buyLink) {
        buyLink.textContent = 'Join Waitlist';
        buyLink.href = '#contact'; // TODO: update with waitlist or contact section
      }
      return;
    }

    // Set current prices
    if (priceStudentEl) priceStudentEl.textContent = formatPrice(current.tier.student);
    if (priceProfessionalEl) priceProfessionalEl.textContent = formatPrice(current.tier.professional);

    // Determine next boundary and countdown
    const nextBoundaryMs = getNextBoundaryMs(current.index);
    if (nextBoundaryMs) {
      const diffMs = nextBoundaryMs - nowAstMs;
      const countdownStr = formatCountdown(diffMs);
      if (countdownStr && countdownContainer && countdownValueEl) {
        countdownValueEl.textContent = countdownStr;
        countdownContainer.style.display = '';
      } else if (countdownContainer) {
        // Hide countdown if within boundary but diff negative
        countdownContainer.style.display = 'none';
      }
    } else {
      // Last day; after this no countdown displayed
      if (countdownContainer) {
        countdownContainer.textContent = 'Final pricing';
      }
    }
  }

  // Initialize on DOMContentLoaded to ensure elements exist
  document.addEventListener('DOMContentLoaded', () => {
    updatePricing();
    // Update every minute
    setInterval(updatePricing, 60 * 1000);
  });
})();