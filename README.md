# Gerenciamento de Tarefas


## Diagrama de Caso de Uso

            +-------------+
            |   Usuário   |
            +-------------+
                  |
   ---------------------------------------
   |            |            |           |
Cadastrar   Listar       Atualizar    Excluir
 Tarefa     Tarefas       Tarefa      Tarefa


## Diagrama de Classe


+------------------+
|     Tarefa       |
+------------------+
| - id             |
| - titulo         |
| - descricao      |
| - concluida      |
+------------------+

+---------------------------+
|    TarefasController      |
+---------------------------+
| + listar()                |
| + adicionar()             |
| + atualizar()             |
| + remover()               |
+---------------------------+
            |
            v
+---------------------------+
|        Database           |
+---------------------------+
| + connect()               |
| + query()                 |
+---------------------------+


## Como executar o projeto
cd GerenciamentoDeTarefas
npm i
npm start


Acesse: http://localhost:3000
