import React, { useState } from "react"
import axios from "axios"
import Page from "./Page"
import { useNavigate } from "react-router-dom" // Import useNavigate for redirection

function ResetPasswordRequest() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const navigate = useNavigate() // Hook for navigation

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const response = await axios.post("/api/request-password-reset", { email })
      setMessage("Password reset token sent. Redirecting to reset page...")
      console.log("Password reset token sent to email:", response.data)
      // Redirect to /reset-password with the token (if returned in response)
      // Note: The current API doesn't return the token in the response, so we'll rely on the console log for now
      navigate("/reset-password")
    } catch (e) {
      setMessage("Error requesting reset: " + (e.response ? e.response.data.error : e.message))
      console.error("Error in reset request:", e)
    }
  }

  return (
    <Page title="Get Token for Password Reset">
      <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email-reset" className="text-muted mb-1">
              <small>Email</small>
            </label>
            <input value={email} onChange={e => setEmail(e.target.value)} id="email-reset" name="email" className="form-control" type="text" placeholder="you@example.com" autoComplete="off" />
          </div>
          <button type="submit" className="py-3 mt-4 btn btn-lg btn-primary btn-block">
            Get Token
          </button>
          {message && <p className="mt-2">{message}</p>}
        </form>
      </div>
    </Page>
  )
}

export default ResetPasswordRequest
