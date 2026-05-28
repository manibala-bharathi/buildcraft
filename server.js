// ===== BUILDCRAFT — BACKEND SERVER (server.js) =====
// Run: node server.js  OR  npm start

const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database/db');

const app = express();
const PORT = process.env.PORT || 4000;

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

/// ===== ROUTES =====

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'BuildCraft API running' });
});

// ---------- ENQUIRIES ----------
app.get('/api/enquiries', (req, res) => {
  try {
    const rows = db.all('SELECT * FROM enquiries ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/enquiries', (req, res) => {
  const { name, email, phone, service, message } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Name, email, phone are required' });
  }
  try {
    const result = db.run(
      'INSERT INTO enquiries (name, email, phone, service, message, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email, phone, service || '', message || '', 'new', new Date().toISOString()]
    );
    res.status(201).json({ id: result.lastInsertRowid, message: 'Enquiry saved!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/enquiries/:id/status', (req, res) => {
  const { status } = req.body;
  try {
    db.run('UPDATE enquiries SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/enquiries/:id', (req, res) => {
  try {
    db.run('DELETE FROM enquiries WHERE id = ?', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- PROJECTS ----------
app.get('/api/projects', (req, res) => {
  try {
    const rows = db.all('SELECT * FROM projects ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/projects', (req, res) => {
  const { title, category, location, image, description } = req.body;
  if (!title || !category) return res.status(400).json({ error: 'Title and category required' });
  try {
    const result = db.run(
      'INSERT INTO projects (title, category, location, image, description) VALUES (?, ?, ?, ?, ?)',
      [title, category, location || '', image || '', description || '']
    );
    res.status(201).json({ id: result.lastInsertRowid, message: 'Project added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/projects/:id', (req, res) => {
  const { title, category, location, image, description } = req.body;
  try {
    db.run(
      'UPDATE projects SET title=?, category=?, location=?, image=?, description=? WHERE id=?',
      [title, category, location, image, description, req.params.id]
    );
    res.json({ message: 'Project updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/projects/:id', (req, res) => {
  try {
    db.run('DELETE FROM projects WHERE id = ?', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- SERVICES ----------
app.get('/api/services', (req, res) => {
  try {
    const rows = db.all('SELECT * FROM services ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/services', (req, res) => {
  const { title, icon, description } = req.body;
  if (!title || !description) return res.status(400).json({ error: 'Title and description required' });
  try {
    const result = db.run(
      'INSERT INTO services (title, icon, description) VALUES (?, ?, ?)',
      [title, icon || 'fas fa-cog', description]
    );
    res.status(201).json({ id: result.lastInsertRowid, message: 'Service added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/services/:id', (req, res) => {
  const { title, icon, description } = req.body;
  try {
    db.run(
      'UPDATE services SET title=?, icon=?, description=? WHERE id=?',
      [title, icon, description, req.params.id]
    );
    res.json({ message: 'Service updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/services/:id', (req, res) => {
  try {
    db.run('DELETE FROM services WHERE id = ?', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Catch-all → serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ===== START =====
db.init().then(() => {
  app.listen(PORT, () => {
    console.log(`
  ╔══════════════════════════════════════╗
  ║   BuildCraft Server Running!         ║
  ║   http://localhost:${PORT}              ║
  ╚══════════════════════════════════════╝
    `);
  });
});

module.exports = app;