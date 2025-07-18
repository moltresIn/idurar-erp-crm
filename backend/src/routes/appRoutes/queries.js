const express = require('express');
const router = express.Router();
const Query = require('../../models/appModels/Query');

// POST /api/queries
router.post('/', async (req, res) => {
  try {
    const query = new Query(req.body);
    await query.save();
    res.status(201).json(query);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/queries/:id
router.get('/:id', async (req, res) => {
  try {
    const query = await Query.findById(req.params.id);
    if (!query) return res.status(404).json({ error: 'Query not found' });
    res.json(query);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/queries/:id
router.put('/:id', async (req, res) => {
  try {
    const query = await Query.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!query) return res.status(404).json({ error: 'Query not found' });
    res.json(query);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/queries/:id/notes
router.post('/:id/notes', async (req, res) => {
  try {
    const query = await Query.findById(req.params.id);
    if (!query) return res.status(404).json({ error: 'Query not found' });
    query.notes.push({ content: req.body.content });
    await query.save();
    res.json(query);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/queries/:id/notes/:noteId
router.delete('/:id/notes/:noteId', async (req, res) => {
  try {
    const query = await Query.findById(req.params.id);
    if (!query) return res.status(404).json({ error: 'Query not found' });
    query.notes.id(req.params.noteId).remove();
    await query.save();
    res.json(query);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
