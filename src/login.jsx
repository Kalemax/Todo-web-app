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
    const { error } = await supabase.auth.signUp({ email, password })
    if(password.length < 8 || !password.contains(/[A-Z]/) || !password.contains(/[a-z]/) || !password.contains(/[0-9]/)) {
      setMessage("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.")
    }else{
      setMessage(error ? error.message : 'Check your email to confirm your account')
    }
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