import { useState } from 'react'
//Pulls all the images for the achievements
import tenTasksLocked from './assets/Badges/png/ten_tasks_locked.png'
import tenTasksBronze from './assets/Badges/png/ten_tasks_bronze.png'
import tenTasksSilver from './assets/Badges/png/ten_tasks_silver.png'
import tenTasksGold from './assets/Badges/png/ten_tasks_gold.png'
import streakLocked from './assets/Badges/png/streak_locked.png'
import streakBronze from './assets/Badges/png/streak_bronze.png'
import streakSilver from './assets/Badges/png/streak_silver.png'
import streakGold from './assets/Badges/png/streak_gold.png'

//Imports the CSS for the achievements page
import './Achievements.css'

function Achievements({ tasks, longestStreak }) {
  //Keeps track of the number of completed tasks
  const totalCompleted = tasks.filter(task => task.completed).length

  //Creates a list of achievements and saves them
  const achievementOne = 
    {
      images: {
        locked: tenTasksLocked,
        bronze: tenTasksBronze,
        silver: tenTasksSilver,
        gold: tenTasksGold,
      }
    }
  const achievementTwo =
    {
      images: {
        locked: streakLocked,
        bronze: streakBronze,
        silver: streakSilver,
        gold: streakGold,
      }
    }

    //Sets up achievement one
    let achievementOneState = "locked"
    let achievementOneName = "Complete 25 tasks" 
    let achievementOneGoal = 25
    if(totalCompleted >= 25 && totalCompleted < 50) {
      achievementOneState = "bronze"
      achievementOneGoal = 50
    }else if(totalCompleted >= 50 && totalCompleted < 100) {
      achievementOneState = "silver"
      achievementOneName = "Complete 50 tasks"
      achievementOneGoal = 100
    }else if(totalCompleted >= 100) {
      achievementOneState = "gold"
      achievementOneName = "Complete 100 tasks"
    }
    const imageSrcOne = achievementOne.images[achievementOneState]

    /*Sets up achievement two*/
    let achievementTwoState = "locked"
    let achievementTwoName = "Complete all tasks for 3 days in a row"
    let achievementTwoGoal = 3
          
    if(longestStreak >= 3 && longestStreak < 7) {
      achievementTwoState = "bronze"
      achievementTwoGoal = 7
    }else if(longestStreak >= 7 && longestStreak < 14) {
      achievementTwoState = "silver"
      achievementTwoName = "Complete all tasks for 7 days in a row"
      achievementTwoGoal = 14
    }else if(longestStreak >= 14) {
      achievementTwoState = "gold"
      achievementTwoName = "Complete all tasks for 14 days in a row"
    }
          const imageSrcTwo = achievementTwo.images[achievementTwoState]


  return (
    <div>
      <h1>Achievements</h1>
      <p>Lifetime tasks completed: {totalCompleted}</p>

      {/*Displays achievements and gives them a visual based on how far in the achievement progression they are*/}
      <ul className="achievements-list">
              <li key={achievementOneName}>
                <p className="achievement-name">{achievementOneName}</p>
                <img className="achievement-badge" src={imageSrcOne} alt={achievementOneName} />
                <p className="achievement-progress">{totalCompleted}/{achievementOneGoal}</p>
              </li>
              <li key={achievementTwoName}>
                <p className="achievement-name">{achievementTwoName}</p>
                <img className="achievement-badge" src={imageSrcTwo} alt={achievementTwoName} />
                <p className="achievement-progress">{longestStreak}/{achievementTwoGoal}</p>
              </li>
      </ul>
    </div>
  )
}

export default Achievements