const express = require('express');
const path = require('path');

const app = express();
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// Serve static files from the public directory
app.use(express.static(PUBLIC_DIR));

// Expose API endpoints for schedule and pricing data
app.get('/api/schedule', (req, res) => {
  const data = require(path.join(__dirname, '..', 'data', 'schedule.json'));
  res.json(data);
});

app.get('/api/pricing', (req, res) => {
  const data = require(path.join(__dirname, '..', 'data', 'pricing.json'));
  res.json(data);
});

// Fallback: serve index.html for any unknown route (useful for client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`PRSPS site running at http://localhost:${port}`);
});