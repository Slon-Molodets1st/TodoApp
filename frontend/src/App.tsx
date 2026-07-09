import React, { useState, useEffect } from 'react';
import { Todo, TodoCreate, TodoUpdate } from './types';
import { api } from './api';
import { TodoForm } from './сomponents/TodoForm';
import { TodoList } from './сomponents/TodoList';
import './App.css';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try{
      setLoading(true);
      const response = await api.getTodos();
      setTodos(response.data);
      setError(null);
    } catch(err){
      setError('Ошибка загрузки задач');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddTodo = async (todo: TodoCreate) => {
    try{
      const response = await api.createTodo(todo);
      setTodos([...todos, response.data]);
    } catch (err) {
      setError('Ошибка загрузки задач');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

   const handleUpdateTodo = async (id: number, todo: TodoUpdate) => {
    try{
      const response = await api.updateTodo(id, todo);
      setTodos(todos.map(t => t.id === id ? response.data : t));
    } catch (err) {
      setError('Ошибка обновления задач');
      console.error(err);
    }
  };

   const handleDeleteTodo = async (id: number) => {
    try{
      await api.deleteTodo(id);
      setTodos(todos.filter(t =>t.id !== id));
    } catch (err) {
      setError('Ошибка удаления задач');
      console.error(err);
    }
  };
  return (
    <div className="App">
      <header className="App-header">
        <h1>Todo приложение</h1>
      </header>
      <main className='app-main'>
        {error && <div className='error-message'>{error}</div>}
        {loading ? (
          <div className='loading'>Загрузка...</div>
        ) : (
          <>
          <TodoForm onAddTodo={handleAddTodo}/>
          <TodoList todos = {todos} onUpdateTodo={handleUpdateTodo} onDeleteTodo={handleDeleteTodo}/>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
