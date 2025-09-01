const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
// Stripe is an optional dependency – install with `npm install stripe` and set your
// secret key via the STRIPE_SECRET_KEY environment variable before running.
let stripe;
try {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
} catch (e) {
  console.warn('Stripe is not installed. Payment routes will be disabled.');
  stripe = null;
}

const app = express();
const PORT = process.env.PORT || 3000;
// Serve static assets from the public folder
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(bodyParser.json());

// Path to data files
const dataDir = path.join(__dirname, '..', 'data');
const attendeesFile = path.join(dataDir, 'attendees.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}
// Ensure attendees file exists
if (!fs.existsSync(attendeesFile)) {
  fs.writeFileSync(attendeesFile, JSON.stringify([], null, 2));
}

// Route to register attendees for free events (e.g. Day 1 panel)
app.post('/register', (req, res) => {
  const {
    name,
    email,
    phone,
    daysAttending = 'day1',
    quantity = 1,
    travelType = '',
    guestNames = [],
    profession = ''
  } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const attendees = JSON.parse(fs.readFileSync(attendeesFile));
    attendees.push({
      name,
      email,
      phone,
      ticketType: '',
      quantity: parseInt(quantity, 10) || 1,
      travelType,
      guestNames,
      daysAttending,
      profession,
      transactionId: '',
      date: new Date().toISOString()
    });
    fs.writeFileSync(attendeesFile, JSON.stringify(attendees, null, 2));
    // Respond with success
    res.json({ status: 'registered' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to register attendee' });
  }
});

// Create a new Stripe Checkout session and log attendee details
app.post('/create-checkout-session', async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ error: 'Stripe is not configured on the server.' });
  }
  const {
    name,
    email,
    phone,
    ticketType,
    quantity = 1,
    guestNames = [],
    travelType,
    daysAttending = 'day2',
    profession = ''
  } = req.body;
  const qty = parseInt(quantity, 10) || 1;
  // Determine ticket price in cents
  const unitAmount = ticketType === 'professional' ? 13500 : 9500;
  const ticketName = ticketType === 'professional' ? 'Professional Ticket' : 'Student Ticket';
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: ticketName
            },
            unit_amount: unitAmount
          },
          quantity: qty
        }
      ],
      mode: 'payment',
      success_url: `${process.env.DOMAIN || ''}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.DOMAIN || ''}/cancel.html`
    });
    // Append attendee with pending transaction id and details
    const attendees = JSON.parse(fs.readFileSync(attendeesFile));
    attendees.push({
      name,
      email,
      phone,
      ticketType,
      quantity: qty,
      travelType,
      guestNames,
      daysAttending,
      profession,
      transactionId: session.id,
      date: new Date().toISOString()
    });
    fs.writeFileSync(attendeesFile, JSON.stringify(attendees, null, 2));
    res.json({ id: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to create checkout session' });
  }
});

// Endpoint to retrieve attendees (simple admin API)
app.get('/api/attendees', (req, res) => {
  const attendees = JSON.parse(fs.readFileSync(attendeesFile));
  res.json(attendees);
});

// Endpoint to retrieve schedule
app.get('/api/schedule', (req, res) => {
  const schedule = JSON.parse(fs.readFileSync(path.join(dataDir, 'schedule.json')));
  res.json(schedule);
});

// Endpoint to retrieve speakers
app.get('/api/speakers', (req, res) => {
  const speakers = JSON.parse(fs.readFileSync(path.join(dataDir, 'speakers.json')));
  res.json(speakers);
});

// Endpoint to retrieve sponsors
app.get('/api/sponsors', (req, res) => {
  const sponsors = JSON.parse(fs.readFileSync(path.join(dataDir, 'sponsors.json')));
  res.json(sponsors);
});

// Start the server
app.listen(PORT, () => {
  console.log(`PRSPS website server running on port ${PORT}`);
});