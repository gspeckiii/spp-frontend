import React, { useContext } from "react"
import { Link } from "react-router-dom" // Importing Link for navigation
import StateContext from "../StateContext" // Import StateContext to access user state

function Footer() {
  const state = useContext(StateContext) // Access the global state

  return (
    <footer className="border-top text-center small text-muted py-3">
      <p>
        <Link to="/" className="mx-1">
          Home
        </Link>{" "}
        |{" "}
        <Link to="/about-us" className="mx-1">
          About Us
        </Link>{" "}
        |{" "}
        <Link to="/terms" className="mx-1">
          Terms
        </Link>
        {" | "}
        <Link to="/register" className="mx-1">
          User Registration
        </Link>
        {state.loggedIn && state.user.admin && (
          <>
            {" | "}
            <Link to="/admin-dashboard" className="mx-1">
              Admin Dashboard
            </Link>
          </>
        )}
      </p>
      <p className="m-0">
        Copyright © {new Date().getFullYear()}
        <Link to="/" className="text-muted">
          Sherman Peck Productions
        </Link>
        . All rights reserved.
      </p>
    </footer>
  )
}

export default Footer
