import React, { useState, useContext } from "react"
import { Link } from "react-router-dom" // Importing Link from react-router-dom for navigation
import HeaderLoggedOut from "./HeaderLoggedOut"
import HeaderLoggedIn from "./HeaderLoggedIn"
import StateContext from "../StateContext"
function Header(props) {
  const appState = useContext(StateContext) // Using useContext to access the global state
  return (
    <header className="header-bar bg-primary mb-3">
      <div className="container d-flex flex-column flex-md-row align-items-center p-3">
        <h4 className="my-0 mr-md-auto font-weight-normal">
          <Link to="/" className="text-white">
            ShermanPeckProductions
          </Link>
        </h4>

        {appState.loggedIn ? <HeaderLoggedIn /> : <HeaderLoggedOut />}
      </div>
    </header>
  )
}
export default Header
