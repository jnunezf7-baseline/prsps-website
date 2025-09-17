const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static content from the public directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Serve assets (CSS, JS, images)
app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));

// Serve data files
app.use('/data', express.static(path.join(__dirname, '..', 'data')));

// Fallback route: send index
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});