const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Store current Resolume connection settings
let resolumeTarget = {
  host: 'localhost',
  port: 8080
};

// Endpoint to update Resolume connection settings
app.post('/api/resolume/connection', (req, res) => {
  const { host, port } = req.body;
  if (host && port) {
    resolumeTarget = { host, port };
    console.log(`Updated Resolume target to ${host}:${port}`);
    res.json({ success: true, host, port });
  } else {
    res.status(400).json({ error: 'Host and port required' });
  }
});

// Proxy all Resolume API requests
app.use('/api/resolume/proxy', (req, res, next) => {
  const targetUrl = `http://${resolumeTarget.host}:${resolumeTarget.port}`;
  
  createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    pathRewrite: {
      '^/api/resolume/proxy': '/api/v1'
    },
    onError: (err, req, res) => {
      console.error('Proxy error:', err);
      res.status(502).json({ 
        error: 'Failed to connect to Resolume Arena',
        details: err.message,
        target: targetUrl
      });
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`Proxying ${req.method} ${req.url} -> ${targetUrl}${req.url.replace('/api/resolume/proxy', '/api/v1')}`);
    }
  })(req, res, next);
});

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
