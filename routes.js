// routes.js
const express = require('express');
const db = require('./database');
const router = express.Router();

// Statistik grup
router.get('/stats', (req, res) => {
  db.all('SELECT * FROM analytics ORDER BY date DESC LIMIT 30', (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(rows);
  });
});

// Leaderboard
router.get('/leaderboard', (req, res) => {
  db.all('SELECT name, points, level, total_messages FROM users ORDER BY points DESC LIMIT 10', (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(rows);
  });
});

// Word Cloud
router.get('/wordcloud', (req, res) => {
  db.all('SELECT most_used_words FROM analytics ORDER BY date DESC LIMIT 1', (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(rows[0] ? JSON.parse(rows[0].most_used_words || '{}') : {});
  });
});

// Kontrol bot (dummy endpoint)
router.post('/bot/:action', (req, res) => {
  // TODO: Integrasi kontrol bot start/stop
  res.json({ status: 'ok', action: req.params.action });
});

module.exports = router; 