function Achievements({ tasks }) {
  //Keeps track of the number of completed tasks
  const totalCompleted = tasks.filter(task => task.completed).length
  return (
    <div>
      <h1>Achievements</h1>
      <p>Lifetime tasks completed: {totalCompleted}</p>
    </div>
  )
}

export default Achievements