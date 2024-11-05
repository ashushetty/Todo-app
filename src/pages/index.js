import {useState, useEffect } from 'react';
import {Check} from 'lucide-react';
import Head from 'next/head';


export default function Home(){
  const[todos, setTodos]= useState([]);

  const[newTodo, setNewTodo]= useState('');

  useEffect(()=>{
    const savedTodos= localStorage.getItem('todos');
    if(savedTodos){
      try{
      setTodos(JSON.parse(savedTodos));
    }catch(error){
      console.error('Error loading todos:',error);
      setTodos([]);
    }
  } 
  
},[]);

useEffect(()=>{
  localStorage.setItem('todos',JSON.stringify(todos));

},[todos]);

//Adds new todo
const handleSubmit = (e) =>{
  if(!newTodo.trim()) return ;

  const newTodoItem ={
    id:Date.now(),
    text:newTodo.trim(),
    completed:false
  };

  setTodos(prevTodos=>[...prevTodos,newTodoItem]);
  setNewTodo('');

};

//Todo completion
const toggleTodo=(id)=>{
  setTodos(prevTodos =>
    prevTodos.map(todo =>
      todo.id === id ? {...todo, completed: !todo.completed }
      : todo
    )
  );

};

//Clear all
const clearAll= () =>{
  setTodos([]);
};


return(
  <>
    <Head>
      <title>Todo List</title>
      <meta name="description" content="Simple todo list application"/>
      <meta name="viewport" content="widht=device-width, initiial-scale=1" />

    </Head>

    <main className='min-h-screen bg-gray-50 p-4'>
      <div className='max-w-2xl mx-auto bg-white rounded-3xl shadow-sm p-8'>
        <h1 className='text-4xl font-bold text-[#1E2B4D] mb-8'>
          To Do List
          </h1>

        <form onSubmit={handleSubmit} >
          <input
            type="text"
            value={newTodo}
            onChange={(e)=> setNewTodo(e.target.value)}
            placeholder="Add new list item"
            className='flex-1 p-3 border border-gray-200 rounded-lg
                      focus:ouline-none focus:ring-2 focus:ring-blue-500
                      placeholder-gray-400 mr-2'
       
          />
          <button
            type="submit"
            disabled={!newTodo.trim()}
            className='px-8 py-3 bg-blue-500 text-white font-medium rounded-lg
                      hover;bg-blue-600 transition-colors
                      disabled:bg-blue-300 disabled:cursor-text-not-allowed'
            >
              Add
            </button>   
      

        </form>

        <ul className='space-y-4 '>
          {todos.map(todo=>(
            <li
              key={todo.id}
              className='flex items-center py-2 gap-3 group'
              >
                <button
                  onClick={()=> toggleTodo(todo.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center
                            justify-center transition-colors
                            ${todo.completed
                              ? 'bg-emerald400 border-emerald-400'
                              : 'border-gray-200 hover:border-blue-500'
                            }`}
                  aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomple' : 'complete '}`}
                >
                  {todo.completed && <Check size={16} color='white' />}
                </button>
                <span
                  className={`flex-1 transition-colors
                  ${todo.completed
                   ? 'line-through text-gray-400'
                   :'text-[#1E2B4D]'
                  
                }`}
                >
                  {todo.text}
                  </span>
              </li>

          ))}
        </ul>

        <div className='mt-8 flex justify-between items-center text-gray-400'>
          <span>{todos.length} items </span>
          <button
            onClick={clearAll}
            className='hover:text-gray-600 transition-colors'
            disabled={todos.length === 0}
            >
               Clear All 
            </button>
        </div>

      </div>
    </main>
  
  </>
)
}