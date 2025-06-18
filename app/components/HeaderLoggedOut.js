import React, { useEffect, useState, useContext } from "react"
import axios from "axios"
import DispatchContext from "../DispatchContext"
import { useNavigate } from "react-router-dom" // Import useNavigate

function HeaderLoggedOut(props) {
  const appDispatch = useContext(DispatchContext)
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()

  const navigate = useNavigate() // Hook for navigation

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const response = await axios.post("/api/login", { username, password })
      if (response.data.token) {
        appDispatch({ type: "logIn", data: response.data })

        console.log("Login successful", response.data)
      } else {
        console.log("Incorrect Username/Password")
      }
    } catch (e) {
      console.error("Login error:", e.response ? e.response.data.error : e.message)
    }
  }

  return (
    // Ensure the form only wraps the login inputs and button
    <div className="mb-0 pt-2 pt-md-0">
      <form onSubmit={handleSubmit} className="row align-items-center">
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input onChange={e => setUsername(e.target.value)} name="username" className="form-control form-control-sm input-dark" type="text" placeholder="Username" autoComplete="off" />
        </div>
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input onChange={e => setPassword(e.target.value)} name="password" className="form-control form-control-sm input-dark" type="password" placeholder="Password" />
        </div>
        <div className="col-md-auto">
          <button type="submit" className="btn btn-success btn-sm mr-2">
            Sign In
          </button>
        </div>
      </form>
      {/* Register button outside the form to avoid form submission */}
      <div className="col-md-auto mt-2"></div>
    </div>
  )
}

export default HeaderLoggedOut
