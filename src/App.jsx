import { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import './App.css'
import { Routes, Route, NavLink } from 'react-router-dom'
import Achievements from './Achievements.jsx'

//These imports allow for Supabase functions (like sign up and log in)
import { supabase } from './supabaseClient'
import Login from './login.jsx'

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

  //Allows for the creation of a new task
  const[newTask, setNewTask] = useState('')

  //Allows for editing a task
  const[editedTask, setEditedTask] = useState('')
  const [editingTaskId, setEditingTaskId] = useState(null)

  //Keeps track of selected date for tasks
  const[selectedDate, setSelectedDate] = useState(new Date())

  //Function to add tasks when the button is pressed, and not do anything if the input is empty
  function handleAddTask() {
    if (newTask.trim() === '') return
    const newTaskObject = { id: Date.now(), text: newTask, completed: false, dueDate: selectedDate}
    setTasks([...tasks, newTaskObject])
    setNewTask('')
  }

  //Function to remove tasks when the button is pressed and the user confirms via a pop-up window
  function handleRemoveTask(id) {
    const updatedTasks = tasks.filter(task => task.id !== id)
    setTasks(updatedTasks)
  }

  
  //Function to mark tasks as completed when the button is pressed, and unmark them if they are already completed
  function handleCompleteTask(id) {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task))
  }

  //Moves the task to the next day
  function moveToTomorrow(id) {
    setTasks(tasks.map(task => task.id === id ? { ...task, dueDate: new Date(new Date(task.dueDate).setDate(new Date(task.dueDate).getDate() + 1)) } : task))
  }

  //Allows the user to edit the text of a task that has already been created
  function handleEditTask(id) {
    setTasks(tasks.map(task => task.id === id ? {...task, text: editedTask} : task))
  }
  //Checks for a streak of tasks being completed in a day
  function calculateStreak(tasks) {
  let streak = 0
  let highest = 0
  let checkDate = new Date()  // start from today

  for (let i = 0; i < 365; i++) { 
    const dayString = checkDate.toDateString()
    const tasksForDay = tasks.filter(task => new Date(task.dueDate).toDateString() === dayString)

    const hasTasks = tasksForDay.length > 0
    const allCompleted = hasTasks && tasksForDay.every(task => task.completed)

    if (!allCompleted){
      streak = 0  // Streak broken; resets to 0
    }else{
      streak++ 
    }
    
    if(streak > highest) {
      highest = streak
    }
    checkDate.setDate(checkDate.getDate() - 1)  // move back one day
  }
  return highest
}
//Holds  longest streak values and saves it to local storage
const longestStreak = calculateStreak(tasks)
localStorage.setItem('longestStreak', longestStreak.toString())

//Calculates current streak
//Counts consecutive fully-completed days ending today (or yesterday, if today isn't finished yet)
function calculateCurrentStreak(tasks) {
  let streak = 0
  const checkDate = new Date()

  //True if the day has at least one task and every task is completed
  function isDayComplete(date) {
    const dayString = date.toDateString()
    const tasksForDay = tasks.filter(task => new Date(task.dueDate).toDateString() === dayString)
    return tasksForDay.length > 0 && tasksForDay.every(task => task.completed)
  }

  //If today has all tasks completed, start from today, but if not, start from yesterday because today shouldn't break the streak
  if (!isDayComplete(checkDate)) {
    checkDate.setDate(checkDate.getDate() - 1)
  }

  for (let i = 0; i < 365; i++) {
    if (!isDayComplete(checkDate)) break
    streak++
    checkDate.setDate(checkDate.getDate() - 1)
  }

  return streak
}
const currentStreak = calculateCurrentStreak(tasks)

//Checks for the most tasks completed in a day and saves it to local storage
function calculateTasksInADay(tasks) {
  const tasksByDate = {}
  for (let i = 0; i < 365; i++) {
    const checkDate = new Date()
    checkDate.setDate(checkDate.getDate() - i)
    const dayString = checkDate.toDateString()
    tasksByDate[dayString] = 0
  }

  tasks.forEach(task => {
    if (task.completed) {
      const dayString = new Date(task.dueDate).toDateString()
      if (dayString in tasksByDate) {
        tasksByDate[dayString]++
      }
    }
  })
  let maxTasksInADay = 0
  for (const day in tasksByDate) {
    if (tasksByDate[day] > maxTasksInADay) {
      maxTasksInADay = tasksByDate[day]
    }
  }

  return maxTasksInADay
}
  const tasksInADay = calculateTasksInADay(tasks)
  localStorage.setItem('tasksInADay', tasksInADay.toString())

  //Only displays tasks that are due on the selected date
  const selectedDateTasks = tasks.filter(task => new Date(task.dueDate).toDateString() === selectedDate.toDateString())

  //Sorts tasks so incomplete tasks are displayed first
  const sortedTasks = [...selectedDateTasks].sort((a, b) => a.completed - b.completed)

  //Lists only today's tasks and counts how many of them are completed
  const todayTasks = tasks.filter(task => new Date(task.dueDate).toDateString() === new Date().toDateString())
  let completedToday = todayTasks.filter(task => task.completed).length

  //Handles the login state of the user, and displays the login page if they are not logged in
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setAuthLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  //If the auth state is still loading, display a loading message. If the user is not logged in, display the login page. Otherwise, display the app.
  if (authLoading) return <p>Loading...</p>
  if (!user) return <Login />

  //Displays the app if logged in
  return(
  
  <div className="app-wrapper">
    <nav>
      <NavLink
        to="/"
        end
        className={({ isActive }) => isActive ? "tab active" : "tab"}
      >
        Tasks
      </NavLink>
      <NavLink
        to="/achievements"
        className={({ isActive }) => isActive ? "tab active" : "tab"}
      >
        Achievements
      </NavLink>
    </nav>
    <button className = "logout-button"onClick={() => supabase.auth.signOut()}>Log Out</button>
    <Routes>
      <Route path="/" element={
        <div className="task-page">
          <h1>Task Grind</h1>
          <p>Tasks remaining today: {todayTasks.length - completedToday}</p>
          <p>Tasks completed today: {completedToday}</p>

          {/*Reads new task and calls task addition function when button is pressed*/}
          {/*The value and onChange combo essentially tells React to always have the textbox value equal to newTask, and to update the value of newTask to whatever is typed everytime the typed input changes*/}
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
          <div className="task-layout">
            <ul>
              {sortedTasks.map((task) => (
                <li key={task.id}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleCompleteTask(task.id)}
                  />

                  {/*Allows for a textbox to appear when editing a task*/}
                  {editingTaskId === task.id ? (
                    <input
                      type="text"
                      value={editedTask}
                      onChange={(e) => setEditedTask(e.target.value)}
                      onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleEditTask(task.id)
                        setEditingTaskId(null)
                      }
                    }}
                    />
                  ) : (
                  <span style={{ textDecoration: task.completed ? "line-through" : "none" }}>
                    {task.text}
                  </span>
                  )}

                  <button onClick={() => {
                    setEditingTaskId(task.id)
                    setEditedTask(task.text)
                  }}>
                  ✏️
                  </button>
                  <button onClick={() => handleRemoveTask(task.id)}>
                    🗑️
                  </button>
                  <button onClick={() => moveToTomorrow(task.id)}>
                    ⏭️
                  </button>
                </li>
              ))}
            </ul>
          </div>

            {/*Renders a calendar to pick the date for tasks*/}
            <div className="calendar-container">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
            />
            </div>
        </div>
      }/>
      <Route path="/achievements" element={
        <Achievements tasks={tasks}
          longestStreak={longestStreak}
          currentStreak={currentStreak}
          tasksInADay={tasksInADay}
        />} 
        />
      </Routes>
  </div>
  )
}

export default App
