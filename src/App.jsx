import { useState, useEffect } from 'react'
import './App.css'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

function App() {
  //Provides a state variable to hold the tasks value and has a function to edit tasks
  const [tasks, setTasks] = useState(() => { 
    const savedTasks = localStorage.getItem('tasks')
    return savedTasks ? JSON.parse(savedTasks) : []
  })

  //Saves the tasks to local storage whenever the tasks state variable is updated
  useEffect(() => {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}, [tasks])

  //Allows for the creation of a new task and the ability to edit it
  const[newTask, setNewTask] = useState('')

  //Keeps track of selected date for tasks
  const[selectedDate, setSelectedDate] = useState(new Date())

  //Keeps track of the number of completed tasks
  let amountCompleted = tasks.filter(task => task.completed).length

  //Function to add tasks when the button is pressed, and not do anything if the input is empty
  function handleAddTask() {
    if (newTask.trim() === '') return
    const newTaskObject = { id: Date.now(), text: newTask, completed: false, dueDate: selectedDate}
    setTasks([...tasks, newTaskObject])
    setNewTask('')
  }

  //Function to remove tasks when the button is pressed
  function handleRemoveTask(id) {
    const updatedTasks = tasks.filter(task => task.id !== id)
    setTasks(updatedTasks)
  }

  //Function to mark tasks as completed when the button is pressed, and unmark them if they are already completed
  function handleCompleteTask(id) {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task))
  }

  //Only displays tasks that are due on the selected date
  const selectedDateTasks = tasks.filter(task => new Date(task.dueDate).toDateString() === selectedDate.toDateString())

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
        {selectedDateTasks.map((task) => (
          <li key={task.id}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => handleCompleteTask(task.id)}
          />
          <span style={{ textDecoration: task.completed ? "line-through" : "none" }}>
            {task.text}
          </span>
          <button onClick={() => handleRemoveTask(task.id)}>
            🗑️
          </button>
          </li>
  ))}

</ul>
      {/*Renders a calendar to pick the date for tasks*/}
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
      />
    </div>
  )

}

export default App
