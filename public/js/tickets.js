document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('ticket-form');
  const message = document.getElementById('payment-message');
  const qtyInput = document.getElementById('quantity');
  const guestContainer = document.getElementById('guest-names-container');
  const daysRadios = document.querySelectorAll('input[name="daysAttending"]');
  const quantityGroup = document.getElementById('quantity-group');
  const travelGroup = document.getElementById('travel-group');
  const ticketTypeGroup = document.getElementById('ticket-type-group');
  const registerButton = document.getElementById('register-button');
  const checkoutButton = document.getElementById('checkout-button');
  const professionSelect = document.getElementById('profession');
  if (!form) return;
  // TODO: Replace the public key with your Stripe publishable key.
  const stripePublicKey = window.STRIPE_PUBLIC_KEY || 'pk_test_REPLACE_ME';
  const stripe = Stripe(stripePublicKey);

  // Dynamically add guest name fields based on quantity
  function updateGuestFields() {
    if (!guestContainer || !qtyInput) return;
    const qty = parseInt(qtyInput.value || '1', 10);
    guestContainer.innerHTML = '';
    if (qty > 1) {
      guestContainer.style.display = 'block';
      // create a label for guest names
      const label = document.createElement('label');
      label.textContent = 'Guest Names (one per ticket)';
      guestContainer.appendChild(label);
      for (let i = 2; i <= qty; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.name = `guest${i}`;
        input.id = `guest${i}`;
        input.placeholder = `Guest ${i} Full Name`;
        input.required = true;
        input.className = 'guest-input';
        guestContainer.appendChild(input);
      }
    } else {
      guestContainer.style.display = 'none';
    }
  }

  if (qtyInput) {
    qtyInput.addEventListener('change', updateGuestFields);
    qtyInput.addEventListener('input', updateGuestFields);
    updateGuestFields();
  }

  /**
   * Update the checkout button text to reflect the total cost based on
   * selected ticket type and quantity. For Day 1 only registrations the
   * button is hidden, so this only executes for Day 2 or both days.
   */
  function updateTotalPrice() {
    if (!checkoutButton || !qtyInput) return;
    // determine selected day
    let selectedDay = null;
    daysRadios.forEach((r) => {
      if (r.checked) selectedDay = r.value;
    });
    // Only compute price for paid days
    if (selectedDay === 'day1') {
      checkoutButton.textContent = 'Proceed to Payment';
      return;
    }
    const qty = parseInt(qtyInput.value || '1', 10);
    const ticketTypeRadio = document.querySelector('input[name="ticketType"]:checked');
    if (!ticketTypeRadio) {
      checkoutButton.textContent = 'Proceed to Payment';
      return;
    }
    const unit = ticketTypeRadio.value === 'professional' ? 135 : 95;
    const total = unit * qty;
    // Update button text with total amount
    checkoutButton.textContent = `Proceed to Payment ($${total})`;
  }

  // Show/hide form sections based on selected day
  function updateFormForDay() {
    // Find selected day radio
    let selected = null;
    daysRadios.forEach((r) => {
      if (r.checked) selected = r.value;
    });
    // If day1 only, hide payment‑related fields and show register button
    if (selected === 'day1') {
      if (quantityGroup) quantityGroup.style.display = 'none';
      if (travelGroup) travelGroup.style.display = 'none';
      if (ticketTypeGroup) ticketTypeGroup.style.display = 'none';
      if (guestContainer) guestContainer.style.display = 'none';
      if (registerButton) registerButton.style.display = 'inline-block';
      if (checkoutButton) checkoutButton.style.display = 'none';
    } else {
      // Day 2 or both – show payment fields
      if (quantityGroup) quantityGroup.style.display = '';
      if (travelGroup) travelGroup.style.display = '';
      if (ticketTypeGroup) ticketTypeGroup.style.display = '';
      // Update guest fields visibility based on quantity
      updateGuestFields();
      if (registerButton) registerButton.style.display = 'none';
      if (checkoutButton) checkoutButton.style.display = 'inline-block';
    }
    // Whenever the day changes, update the total price display
    updateTotalPrice();
  }

  daysRadios.forEach((r) => {
    r.addEventListener('change', updateFormForDay);
  });
  // Set initial state on load
  updateFormForDay();

  // Update total price when quantity or ticket type changes
  if (qtyInput) {
    qtyInput.addEventListener('change', updateTotalPrice);
    qtyInput.addEventListener('input', updateTotalPrice);
  }
  // Add listener to ticket type radio buttons
  const ticketTypeRadios = document.querySelectorAll('input[name="ticketType"]');
  ticketTypeRadios.forEach((radio) => {
    radio.addEventListener('change', updateTotalPrice);
  });
  // Initialize price display on load
  updateTotalPrice();

  // Handler for free registration button
  if (registerButton) {
    registerButton.addEventListener('click', async (e) => {
      e.preventDefault();
      message.hidden = true;
      const formData = new FormData(form);
      // Build attendee data for free registration
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        daysAttending: 'day1',
        quantity: 1,
        travelType: '',
        guestNames: []
        ,profession: professionSelect ? professionSelect.value : ''
      };
      try {
        const response = await fetch('/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || 'Server error');
        }
        // Redirect to success page on free registration
        window.location.href = '/success.html';
      } catch (err) {
        console.error(err);
        message.textContent = 'Error: ' + err.message;
        message.hidden = false;
      }
    });
  }
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    message.hidden = true;
    const formData = new FormData(form);
    const quantity = parseInt(formData.get('quantity') || '1', 10);
    const travelType = formData.get('travelType');
    const daysAttending = formData.get('daysAttending');
    // Build array of guest names (exclude primary attendee)
    const guestNames = [];
    for (let i = 2; i <= quantity; i++) {
      const guestName = formData.get(`guest${i}`);
      if (guestName) guestNames.push(guestName);
    }
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      ticketType: formData.get('ticketType'),
      quantity: quantity,
      travelType: travelType,
      guestNames: guestNames
      ,daysAttending: daysAttending
      ,profession: professionSelect ? professionSelect.value : ''
    };
    // If attendee selected day1 only, the register button handler should have taken care of submission.
    // Guard here to ensure we only process paid tickets.
    if (daysAttending === 'day1') {
      return;
    }
    try {
      const response = await fetch('/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Server error');
      }
      const session = await response.json();
      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({ sessionId: session.id });
      if (result.error) {
        throw result.error;
      }
    } catch (err) {
      console.error(err);
      message.textContent = 'Error: ' + err.message;
      message.hidden = false;
    }
  });
});