import React, { useEffect, useState, useContext } from "react"
import axios from "axios"
import DispatchContext from "../DispatchContext"
import { useNavigate } from "react-router-dom"

function HeaderLoggedOut(props) {
  const appDispatch = useContext(DispatchContext)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      console.log("Attempting login with:", { username, password })
      const response = await axios.post("/users/login", { username, password })
      console.log("Login response:", response.data)
      if (response.data.token) {
        appDispatch({ type: "logIn", data: response.data })
        appDispatch({ type: "flashMessage", value: "You have successfully logged in!" })
        navigate("/") // Redirect to homepage
      } else {
        appDispatch({ type: "flashMessage", value: "Incorrect username or password." })
      }
    } catch (e) {
      console.error("Login error:", e.response ? e.response.data : e.message)
      appDispatch({ type: "flashMessage", value: e.response?.data?.error || "Login failed. Please try again." })
    }
  }

  return (
    <div className="mb-0 pt-2 pt-md-0">
      <form onSubmit={handleSubmit} className="row align-items-center">
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input onChange={e => setUsername(e.target.value)} name="username" className="form-control form-control-sm input-dark" type="text" placeholder="Username" autoComplete="off" value={username} />
        </div>
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input onChange={e => setPassword(e.target.value)} name="password" className="form-control form-control-sm input-dark" type="password" placeholder="Password" value={password} />
        </div>
        <div className="col-md-auto">
          <button type="submit" className="btn btn-success btn-sm mr-2">
            Sign In
          </button>
        </div>
      </form>
      <div className="col-md-auto mt-2"></div>
    </div>
  )
}

export default HeaderLoggedOut
