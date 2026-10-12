import { useState } from 'react'
import { supabase } from './supabaseClient'
import './login.css'

//Change this one line to rename the app on the login screen
const APP_NAME = 'ToGrind'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')



  async function handleSignUp() {
    //Conditions for a valid password 
    const longEnough = password.length >= 8
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    //Returns an error if password conditions are not met
    if(!longEnough || !hasUpper || !hasLower || !hasNumber) {
      setMessage("Password must contain:\n- At least 8 characters\n- At least one uppercase letter\n- At least one lowercase letter\n- At least one number")
      return
    }
    
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setMessage(error.message)
      return
    }
    setMessage("Account created!")
  }

  async function handleLogIn(e) {
    e.preventDefault() //Stops the form from reloading the page, lets Enter submit
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setMessage("Invalid login credentials. Please try again.")
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">{APP_NAME}</h1>
        <p className="login-subtitle">Log in to keep the grind going</p>

        <form className="login-form" onSubmit={handleLogIn}>
          <input
            className="login-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            className="login-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button className="login-button" type="submit">Log In</button>
          <button className="login-button secondary" type="button" onClick={handleSignUp}>
            Sign Up
          </button>
        </form>

        {message && <p className="login-message">{message}</p>}
      </div>
    </div>
  )
}

export default Login