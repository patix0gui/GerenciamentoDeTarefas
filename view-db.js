const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho absoluto do banco
const dbPath = path.join(__dirname, 'database', 'tarefas.db');
console.log('Tentando abrir o banco em:', dbPath);

// Abrir o banco (cria se não existir)
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('❌ Erro ao abrir DB:', err.message);
        process.exit(1);
    } else {
        console.log('✅ Banco conectado com sucesso!');
    }
});

// Criar tabela se não existir
db.run(`
    CREATE TABLE IF NOT EXISTS tarefas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        descricao TEXT,
        prioridade TEXT,
        concluida INTEGER DEFAULT 0
    )
`, (err) => {
    if (err) console.error('❌ Erro ao criar tabela:', err.message);
});

// Listar todas as tarefas
db.all('SELECT * FROM tarefas ORDER BY id DESC', [], (err, rows) => {
    if (err) {
        console.error('❌ Erro ao consultar tarefas:', err.message);
    } else if (rows.length === 0) {
        console.log('⚠️ Nenhuma tarefa encontrada.');
    } else {
        console.log('📝 Lista de tarefas:\n');
        rows.forEach(row => {
            console.log(`ID: ${row.id}`);
            console.log(`Título: ${row.titulo}`);
            console.log(`Descrição: ${row.descricao || '-'}`);
            console.log(`Prioridade: ${row.prioridade || '-'}`);
            console.log(`Concluída: ${row.concluida ? '✅ Sim' : '❌ Não'}`);
            console.log('----------------------------');
        });
    }
    db.close();
});
