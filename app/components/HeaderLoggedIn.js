import React, { useEffect, useState, useContext } from "react"
import { Link } from "react-router-dom"
import DispatchContext from "../DispatchContext.js"
import StateContext from "../StateContext.js"
function HeaderLoggedIn(props) {
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)

  function handleLogOut() {
    appDispatch({ type: "logOut" })

    window.location = "/"
  }
  return (
    <div>
      <div className="site-header__btn-container">
        <button onClick={handleLogOut} className="btn open-modal">
          Sign Out
        </button>
      </div>

      <nav className="primary-nav primary-nav--pull-right">
        <ul>
          <li>
            <Link to="/About" id="our-beginning-link">
              My Story
            </Link>
          </li>
          <li>
            <Link to="/Categories" id="features-link">
              Products
            </Link>
          </li>
          <li>
            <Link to="/Services" id="testimonials-link">
              Services
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default HeaderLoggedIn

/*
    <div className="form-controls">
      <Link to={`/profile/${appState.username}`}>
        <img className="site-header__icon" src={appState.user.avatar} />
      </Link>
      <Link to="/orders">
      Orders
      </Link>
     
      <div className="form-controls__group form-controls__group--dark">
        <button onClick={handleLogOut} className="form-controls__button form-controls--small">
          Sign Out
        </button>
      </div>
    </div>

*/
