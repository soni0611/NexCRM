import { useState, useEffect } from 'react';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

  // READ
  useEffect(() => {
    axiosInstance.get('/todos')
      .then(res => setTodos(res.data))
      .catch(err => console.error('Error fetching todos:', err));
  }, []);

  // CREATE
  const addTodo = async () => {
    if (!input.trim()) return;
    try {
      const res = await axiosInstance.post('/todos', { title: input });
      setTodos([res.data, ...todos]);
      setInput('');
    } catch (err) {
      console.error('Error adding todo:', err);
    }
  };

  // UPDATE (toggle complete)
  const toggleTodo = async (todo) => {
    try {
      const res = await axiosInstance.put(`/todos/${todo._id}`, { completed: !todo.completed });
      setTodos(todos.map(t => t._id === res.data._id ? res.data : t));
    } catch (err) {
      console.error('Error updating todo:', err);
    }
  };

  // UPDATE (edit title)
  const saveEdit = async (id) => {
    try {
      const res = await axiosInstance.put(`/todos/${id}`, { title: editText });
      setTodos(todos.map(t => t._id === res.data._id ? res.data : t));
      setEditId(null);
    } catch (err) {
      console.error('Error saving edit:', err);
    }
  };

  // DELETE
  const deleteTodo = async (id) => {
    try {
      await axiosInstance.delete(`/todos/${id}`);
      setTodos(todos.filter(t => t._id !== id));
    } catch (err) {
      console.error('Error deleting todo:', err);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: '40px auto', padding: '0 16px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 20 }}>My Todos</h1>

      {/* Add todo */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTodo()}
          placeholder="Add a new todo..."
          style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid #ccc' }}
        />
        <button onClick={addTodo} style={{ padding: '8px 16px', borderRadius: 8, background: '#4f46e5', color: '#fff', border: 'none', cursor: 'pointer' }}>Add</button>
      </div>

      {/* Todo list */}
      {todos.map(todo => (
        <div key={todo._id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid #eee' }}>
          <input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo)} />
          {editId === todo._id ? (
            <>
              <input value={editText} onChange={e => setEditText(e.target.value)} style={{ flex: 1, padding: '4px 8px', borderRadius: 6, border: '1px solid #ccc' }} />
              <button onClick={() => saveEdit(todo._id)}>Save</button>
            </>
          ) : (
            <>
              <span style={{ flex: 1, textDecoration: todo.completed ? 'line-through' : 'none', color: todo.completed ? '#999' : '#111' }}>{todo.title}</span>
              <button onClick={() => { setEditId(todo._id); setEditText(todo.title); }}>Edit</button>
            </>
          )}
          <button onClick={() => deleteTodo(todo._id)} style={{ color: 'red' }}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;