import React, { useState, useContext } from "react"
import Axios from "axios"
import DispatchContext from "../DispatchContext"
import { useNavigate } from "react-router-dom"

function HeaderLoggedOut({ closeModal }) {
  const appDispatch = useContext(DispatchContext)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      console.log("Attempting login with:", { username, password })
      const response = await Axios.post("/users/login", { username, password })
      console.log("Login response:", response.data)
      if (response.data.token) {
        appDispatch({ type: "logIn", data: response.data })
        appDispatch({ type: "flashMessage", value: "You have successfully logged in!" })
        navigate("/")
        closeModal() // Close modal on successful login
      } else {
        appDispatch({ type: "flashMessage", value: "Incorrect username or password." })
      }
    } catch (e) {
      console.error("Login error:", e.response ? e.response.data : e.message)
      appDispatch({ type: "flashMessage", value: e.response?.data?.error || "Login failed. Please try again." })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-controls">
      <div className="form-controls__group form-controls__group--dark">
        <input onChange={e => setUsername(e.target.value)} name="username" className="form-controls__input" type="text" placeholder="Username" autoComplete="off" value={username} />
      </div>
      <div className="form-controls__group form-controls__group--dark">
        <input onChange={e => setPassword(e.target.value)} name="password" className="form-controls__input" type="password" placeholder="Password" value={password} />
      </div>
      <div className="form-controls__group form-controls__group--dark">
        <button type="submit" className="form-controls__button">
          Sign In
        </button>
      </div>
    </form>
  )
}

export default HeaderLoggedOut
