const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Projects endpoints
app.get('/api/projects', (req, res) => {
  // TODO: Implement project listing
  res.json({ projects: [] });
});

app.post('/api/projects', (req, res) => {
  // TODO: Implement project creation
  res.json({ success: true });
});

// Cues endpoints
app.get('/api/cues', (req, res) => {
  // TODO: Implement cue listing
  res.json({ cues: [] });
});

app.post('/api/cues', (req, res) => {
  // TODO: Implement cue creation
  res.json({ success: true, cue: req.body });
});

app.put('/api/cues/:id', (req, res) => {
  // TODO: Implement cue update
  res.json({ success: true, cue: req.body });
});

app.delete('/api/cues/:id', (req, res) => {
  // TODO: Implement cue deletion
  res.json({ success: true });
});

// Resolume OSC endpoints
app.post('/api/resolume/osc', (req, res) => {
  // TODO: Implement OSC communication
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
