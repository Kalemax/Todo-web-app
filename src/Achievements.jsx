import { useState } from 'react'
//Pulls all the images for the achievements
import tenTasksLocked from './assets/Badges/png/ten_tasks_locked.png'
import tenTasksBronze from './assets/Badges/png/ten_tasks_bronze.png'
import tenTasksSilver from './assets/Badges/png/ten_tasks_silver.png'
import tenTasksGold from './assets/Badges/png/ten_tasks_gold.png'
//Imports the CSS for the achievements page
import './Achievements.css'

function Achievements({ tasks }) {
  //Keeps track of the number of completed tasks
  const totalCompleted = tasks.filter(task => task.completed).length

  //Creates a list of achievements and saves them
  const achievements = [
    {
      name: "Complete 10 tasks", //change this later since this description needs to change
      images: {
        locked: tenTasksLocked,
        bronze: tenTasksBronze,
        silver: tenTasksSilver,
        gold: tenTasksGold,
      }
    }
  ]

  return (
    <div>
      <h1>Achievements</h1>
      <p>Lifetime tasks completed: {totalCompleted}</p>

      {/*Displays achievements and gives them a visual based on how far in the achievement progression they are*/}
      <ul className="achievements-list">
        {achievements.map((achievement) => {
          let state = "locked"
          if(totalCompleted >= 10 && totalCompleted < 25) {
            state = "bronze"
          }else if(totalCompleted >= 25 && totalCompleted < 50) {
            state = "silver"
          }else if(totalCompleted >= 50) {
            state = "gold"
          }
          const imageSrc = achievement.images[state]
          return (
            <li key={achievement.name}>
              <p className="achievement-name">{achievement.name}</p>
              <img className="achievement-badge" src={imageSrc} alt={achievement.name} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Achievements