
const API_URL = 'http://localhost:3000/tarefas';
const form = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const clearBtn = document.getElementById('clearBtn');
let editingId = null;

async function fetchTasks() {
  const res = await fetch(API_URL);
  return res.json();
}

function createTaskElement(task) {
  const div = document.createElement('div');
  div.className = 'task';
  if (task.concluida) div.classList.add('task-concluded');

  const header = document.createElement('div');
  header.className = 'task-header';

  const title = document.createElement('h3');
  title.textContent = task.titulo;
  header.appendChild(title);

  const btns = document.createElement('div');
  btns.className = 'task-actions';

  // Concluir button
  const concludeBtn = document.createElement('button');
  concludeBtn.className = 'btn btn-success';
  concludeBtn.textContent = task.concluida ? 'Concluída' : 'Concluir';
  concludeBtn.disabled = !!task.concluida;
  concludeBtn.addEventListener('click', async () => {
    const resp = await fetch(`${API_URL}/${task.id}/concluir`, { method: 'PATCH' });
    if (resp.ok) {
      // visual effect: add class which triggers animation
      div.classList.add('task-concluded');
      concludeBtn.textContent = 'Concluída';
      concludeBtn.disabled = true;
    } else {
      alert('Erro ao marcar como concluída');
    }
  });
  btns.appendChild(concludeBtn);

  // Edit button: fill the form for in-place editing
  const editBtn = document.createElement('button');
  editBtn.className = 'btn btn-primary';
  editBtn.textContent = 'Editar';
  editBtn.addEventListener('click', async () => {
    // populate form fields and set editingId
    document.getElementById('titulo').value = task.titulo || '';
    document.getElementById('descricao').value = task.descricao || '';
    document.getElementById('prioridade').value = task.prioridade || 'baixa';
    editingId = task.id;
    // focus title for quick editing
    document.getElementById('titulo').focus();
    // change submit button text to indicate editing
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.textContent = '💾 Salvar Alterações';
  });
  btns.appendChild(editBtn);

  // Delete button
  const delBtn = document.createElement('button');
  delBtn.className = 'btn btn-danger';
  delBtn.textContent = 'Excluir';
  delBtn.addEventListener('click', async () => {
    if (!confirm('Excluir esta tarefa?')) return;
    await fetch(`${API_URL}/${task.id}`, { method: 'DELETE' });
    renderTasks();
  });
  btns.appendChild(delBtn);

  header.appendChild(btns);
  div.appendChild(header);

  const desc = document.createElement('p');
  desc.textContent = task.descricao || '';
  div.appendChild(desc);

  const meta = document.createElement('div');
  meta.className = 'task-meta';
  meta.innerHTML = `<span class="priority-badge">${task.prioridade}</span>`;
  div.appendChild(meta);

  return div;
}

async function renderTasks() {
  const tasks = await fetchTasks();
  taskList.innerHTML = '';
  tasks.forEach(t => {
    const el = createTaskElement(t);
    taskList.appendChild(el);
  });
}

// submit: if editingId then PUT to update, else POST to create
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const titulo = document.getElementById('titulo').value.trim();
  const descricao = document.getElementById('descricao').value.trim();
  const prioridade = document.getElementById('prioridade').value;
  if (!titulo) return alert('Título é obrigatório');

  const body = { titulo, descricao, prioridade };

  if (editingId) {
    // update existing
    const res = await fetch(`${API_URL}/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) alert('Erro ao atualizar a tarefa');
    editingId = null;
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.textContent = '➕ Adicionar Tarefa';
  } else {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
  }

  form.reset();
  renderTasks();
});

clearBtn.addEventListener('click', async () => {
  if (!confirm('Tem certeza que deseja limpar todas as tarefas?')) return;
  const tasks = await fetchTasks();
  for (const t of tasks) {
    await fetch(`${API_URL}/${t.id}`, { method: 'DELETE' });
  }
  renderTasks();
});

renderTasks();
