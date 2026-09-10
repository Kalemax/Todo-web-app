import { useState } from 'react'
import './App.css'

function App() {
  //Provides a state variable to hold the tasks value and has a function to edit tasks
  const [tasks, setTasks] = useState([])
  const[newTask, setNewTask] = useState('')
  let amountCompleted = tasks.filter(task => task.completed).length

  //Function to add tasks when the button is pressed, and not do anything if the input is empty
  function handleAddTask() {
    if (newTask.trim() === '') return
    const newTaskObject = { id: Date.now(), text: newTask, completed: false }
    setTasks([...tasks, newTaskObject])
    setNewTask('')
  }

  function handleRemoveTask(id) {
    const updatedTasks = tasks.filter(task => task.id !== id)
    setTasks(updatedTasks)
  }

  function handleCompleteTask(id) {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task))
    amountCompleted = tasks.filter(task => task.completed).length
  }

  //Displays the app
  return(
    <div>
      <h1>Task Grind</h1>
      <p>Tasks remaining: {tasks.length - amountCompleted}</p>
      <p>Tasks completed: {amountCompleted}</p>

      {/*Reads new task and calls task addition function when button is pressed*/}
      <input
        type = "text"
        value = {newTask}
        onChange = {(e) => setNewTask(e.target.value)}
        onKeyDown = {(e) => {
          if (e.key === 'Enter') handleAddTask()
        }}
      />
      <button onClick={handleAddTask}>Add Task</button>

      {/*Creates each task with their own buttons*/}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
          {task.text}
          <button onClick={() => handleCompleteTask(task.id)}>
            {task.completed ? "Undo" : "Complete"}
          </button>
          <button onClick={() => handleRemoveTask(task.id)}>
            Delete Task
          </button>
          </li>
  ))}
</ul>
    </div>
  )

}

export default App
