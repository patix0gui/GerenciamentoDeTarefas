const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Listar tarefas
router.get('/', (req, res) => {
  db.all('SELECT * FROM tarefas', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Criar tarefa
router.post('/', (req, res) => {
  const { titulo, descricao, prioridade } = req.body;
  db.run(
    'INSERT INTO tarefas (titulo, descricao, prioridade) VALUES (?, ?, ?)',
    [titulo, descricao, prioridade],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// Atualizar tarefa
router.put('/:id', (req, res) => {
  const { titulo, descricao, prioridade, concluida } = req.body;
  db.run(
    'UPDATE tarefas SET titulo = ?, descricao = ?, prioridade = ?, concluida = ? WHERE id = ?',
    [titulo, descricao, prioridade, concluida ? 1 : 0, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});


// Marcar tarefa como concluída
router.patch('/:id/concluir', (req, res) => {
  db.run('UPDATE tarefas SET concluida = 1 WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updated: this.changes });
  });
});


// Deletar tarefa
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM tarefas WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

module.exports = router;
