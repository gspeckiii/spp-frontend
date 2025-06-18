import React, { useState, useEffect } from "react"
import axios from "axios"
import { useSearchParams, useNavigate } from "react-router-dom" // Added useNavigate
import Page from "./Page.js"

function ResetPassword() {
  const [token, setToken] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [message, setMessage] = useState("")
  const [searchParams] = useSearchParams()
  const urlToken = searchParams.get("token") // Store the original URL token
  const navigate = useNavigate() // Hook for navigation

  useEffect(() => {
    // Set initial token from URL, allowing pasting to override it
    if (urlToken) {
      setToken(urlToken)
    }
  }, [urlToken])

  async function handleSubmit(e) {
    e.preventDefault()
    console.log("Submitting with token:", token, "URL token:", urlToken) // Debug
    if (!token) {
      setMessage("No reset token provided")
      return
    }
    // Validate token against URL token if provided
    if (urlToken && token !== urlToken) {
      setMessage("Token mismatch. Please use the token from the URL or paste the correct one.")
      return
    }
    try {
      const response = await axios.post("/api/reset-password", { token, newPassword })
      setMessage(response.data.message)
      // Redirect to /home after success
      setTimeout(() => navigate("/"), 0) // Delay for user to see success message
    } catch (e) {
      console.error("Error resetting password:", e) // Detailed error log
      setMessage(e.response ? e.response.data.error : "Error resetting password")
    }
  }

  return (
    <Page title="Reset Password">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
            <h2 className="text-center mb-4" style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 700 }}>
              Reset Your Password
            </h2>
            <p className="text-center text-muted mb-4" style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }}>
              Please enter your new password below.
            </p>
            <form onSubmit={handleSubmit} className="needs-validation" noValidate>
              <div className="form-group">
                <label htmlFor="token-field" className="text-muted mb-1" style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }}>
                  <small>
                    Reset Token <span className="text-info">(Editable, Paste if Needed)</span>
                  </small>
                </label>
                <input
                  value={token}
                  onChange={e => setToken(e.target.value)} // Allow pasting and editing
                  id="token-field"
                  className="form-control form-control-lg"
                  type="text"
                  tabIndex="0"
                  onFocus={e => e.target.select()} // Select text on focus
                />
                <small className="form-text text-muted" style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 300 }}>
                  Paste or edit the token from the password reset request. Use Ctrl+C to copy.
                </small>
              </div>
              <div className="form-group">
                <label htmlFor="new-password" className="text-muted mb-1" style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }}>
                  <small>New Password</small>
                </label>
                <input value={newPassword} onChange={e => setNewPassword(e.target.value)} id="new-password" className="form-control form-control-lg" type="password" placeholder="Enter new password" required />
                <div className="invalid-feedback">Please provide a new password.</div>
              </div>
              <button type="submit" className="btn btn-primary btn-lg btn-block mt-4">
                Reset Password
              </button>
              {message && (
                <p className="mt-2 text-success" style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }}>
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css?family=Public+Sans:300,400,400i,700,700i&display=swap');
          body {
            font-family: 'Public Sans', sans-serif;
          }
          .form-control-lg {
            font-size: 1.1rem;
            padding: 0.75rem 1rem;
          }
          .form-control-lg:focus {
            outline: none;
            box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
          }
          .btn-primary {
            background-color: #007bff;
            border-color: #007bff;
          }
          .btn-primary:hover {
            background-color: #0056b3;
            border-color: #0056b3;
          }
          .text-success {
            color: #28a745;
          }
          .text-info {
            color: #17a2b8;
          }
          .invalid-feedback {
            display: none;
          }
          .needs-validation:invalid .invalid-feedback {
            display: block;
          }
          .needs-validation:invalid .form-control {
            border-color: #dc3545;
          }
        `}
      </style>
    </Page>
  )
}

export default ResetPassword
