import { useState, useEffect } from 'react';
import { Check, Trash, Edit3 } from 'lucide-react';
import Head from 'next/head';

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [isEditing, setIsEditing] = useState(null); // Track editing status
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState('all'); // Filter state (all, active, completed)

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (error) {
        console.error('Error loading todos:', error);
        setTodos([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const newTodoItem = {
      id: Date.now(),
      text: newTodo.trim(),
      completed: false,
    };

    setTodos((prevTodos) => [...prevTodos, newTodoItem]);
    setNewTodo('');
  };

  const toggleTodo = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const clearAll = () => {
    setTodos([]);
  };

  const startEditTodo = (id, currentText) => {
    setIsEditing(id);
    setEditText(currentText);
  };

  const saveEditTodo = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, text: editText } : todo
      )
    );
    setIsEditing(null);
    setEditText('');
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'all') return true;
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
  });

  return (
    <>
      <Head>
        <title>Todo List</title>
        <meta name="description" content="Simple todo list application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-sm px-8 sm:px-16 lg:px-40 py-10 sm:py-20 mt-10 sm:mt-20 mb-10 sm:mb-20">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#192b57] mb-4 sm:mb-8">
            Daily To Do List
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row border-2 border-gray-200 rounded-lg py-1 px-1">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Add new task"
                className="flex-1 p-3 border border-gray-200 rounded-lg placeholder-gray-400 mr-2 sm:mr-2 mb-2 sm:mb-0 border-none outline-none text-gray-500"
              />
              <button
                type="submit"
                disabled={!newTodo.trim()}
                className="w-full sm:w-auto px-8 py-3 bg-blue-500 text-white font-medium rounded-lg"
              >
                Add
              </button>
            </div>
          </form>

          <div className="mt-4 flex flex-wrap gap-4 text-gray-400">
            <button onClick={() => setFilter('all')}>All</button>
            <button onClick={() => setFilter('active')}>Active</button>
            <button onClick={() => setFilter('completed')}>Completed</button>
          </div>

          <ul className="space-y-2 sm:space-y-4 mt-4 px-3 sm:px-5">
            {filteredTodos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center py-2 gap-3 group cursor-pointer"
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    todo.completed
                      ? 'bg-emerald-400 border-emerald-400'
                      : 'border-gray-200'
                  }`}
                >
                  {todo.completed && <Check size={16} color="white" />}
                </button>

                {isEditing === todo.id ? (
                  <>
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-1 p-2 border border-gray-200 rounded-lg text-gray-500"
                    />
                    <button
                      onClick={() => saveEditTodo(todo.id)}
                      className="text-blue-500"
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <span
                      className={`flex-1 ${
                        todo.completed
                          ? 'line-through text-gray-400'
                          : 'text-[#1E2B4D]'
                      } group-hover:text-blue-700`}
                    >
                      {todo.text}
                    </span>
                    <button
                      onClick={() => startEditTodo(todo.id, todo.text)}
                      className="text-gray-500"
                    >
                      <Edit3 size={18} />
                    </button>
                  </>
                )}

                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-gray-600 hover:text-red-500"
                >
                  <Trash size={18} />
                </button>
              </li>
            ))}
          </ul>
          <hr className="mt-20"></hr>
          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center text-gray-600 space-y-2 sm:space-y-0">
            <span>{todos.length} items</span>
            <button
              onClick={clearAll}
              className="hover:text-gray-600 transition-colors"
              disabled={todos.length === 0}
            >
              Clear All
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
