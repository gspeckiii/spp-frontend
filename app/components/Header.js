// Header.js
import React, { useState, useContext } from "react"
import { Link } from "react-router-dom"
import HeaderLoggedOut from "./HeaderLoggedOut"
import HeaderLoggedIn from "./HeaderLoggedIn"
import StateContext from "../StateContext"

function Header(props) {
  const appState = useContext(StateContext)
  return (
    <header className="site-header">
      <div className="wrapper">
        <div className="site-header__logo">
          <img src="assets/images/icons/spp-logo.svg" alt="SPP Logo"></img>
        </div>

        <div className="site-header__menu-icon">
          <div className="site-header__menu-icon__middle"></div>
        </div>

        {/* FIX: Add site-header__menu-content to this div */}
        <div className="site-header__menu-content primary-nav primary-nav--pull-right">{appState.loggedIn ? <HeaderLoggedIn /> : <HeaderLoggedOut />}</div>
      </div>
    </header>
  )
}

export default Header
