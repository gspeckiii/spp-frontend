import React, { useContext } from "react"
import { Link } from "react-router-dom" // Importing Link for navigation
import StateContext from "../StateContext" // Import StateContext to access user state

function Footer() {
  const state = useContext(StateContext) // Access the global state

  return (
    <footer className="site-footer">
      <p>
        <Link to="/" className="text-muted white-font">
          {" "}
          Sherman Peck Productions{" "}
        </Link>{" "}
        |{" "}
        <Link to="/about-us" className="mx-1 white-font">
          About Us
        </Link>{" "}
        |{" "}
        <Link to="/terms" className="mx-1 white-font">
          Terms
        </Link>
        {" | "}
        {state.loggedIn && state.user.admin && (
          <>
            <Link to="/admin-dashboard" className="mx-1 white-font">
              Admin Dashboard
            </Link>
            {" | "}
          </>
        )}
        All rights reserved. Copyright © {new Date().getFullYear()}
      </p>
    </footer>
  )
}

export default Footer
