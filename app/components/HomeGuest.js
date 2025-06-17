import React, { useState } from "react"
import Page from "./Page"
import axios from "axios" // Changed from Axios to axios to match the package name
import { Link } from "react-router-dom"

function HomeGuest() {
  const [username, setUsername] = useState()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await axios.post("/api/users", { username, email, password })
      console.log("Registration successful")
    } catch (e) {
      console.error("Error in registration:", e.response ? e.response.data.error : e.message)
    }
  }

  return (
    <Page title="Home" wide={true}>
      <div className="row align-items-center">
        <div className="col-lg-7 py-3 py-md-5">
          <h1 className="display-3">Sherman Peck Productions</h1>
          <p className="lead text-muted">Sign up to be a part of the Sherman Peck Productions and gain access to a portfolio of Engineering and Art Projects that may enrich your business or life.</p>
        </div>
        <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username-register" className="text-muted mb-1">
                <small>Username</small>
              </label>
              <input onChange={e => setUsername(e.target.value)} id="username-register" name="username" className="form-control" type="text" placeholder="Pick a username" autoComplete="off" />
            </div>
            <div className="form-group">
              <label htmlFor="email-register" className="text-muted mb-1">
                <small>Email</small>
              </label>
              <input onChange={e => setEmail(e.target.value)} id="email-register" name="email" className="form-control" type="text" placeholder="you@example.com" autoComplete="off" />
            </div>
            <div className="form-group">
              <label htmlFor="password-register" className="text-muted mb-1">
                <small>Password</small>
              </label>
              <input onChange={e => setPassword(e.target.value)} id="password-register" name="password" className="form-control" type="password" placeholder="Create a password" />
            </div>
            <button type="submit" className="py-3 mt-4 btn btn-lg btn-success btn-block">
              Sign up for Sherman Peck Productions
            </button>
          </form>

          <Link to="/reset-password-request" className="py-3 mt-4 btn btn-lg btn-primary btn-block">
            Reset Password With Your Email
          </Link>
        </div>
      </div>
    </Page>
  )
}

export default HomeGuest
