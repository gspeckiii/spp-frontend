import React, { useState, useContext } from "react"
import { Link } from "react-router-dom"
import HeaderLoggedOut from "./HeaderLoggedOut"
import HeaderLoggedIn from "./HeaderLoggedIn"
import StateContext from "../StateContext"

function Header() {
  const appState = useContext(StateContext)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const handleKeyPress = e => {
    if (e.key === "Escape") {
      closeModal()
    }
  }

  return (
    <header className={`site-header ${isMenuOpen ? "site-header--is-expanded" : ""}`}>
      <div className="wrapper">
        <div className="site-header__logo">
          <Link to="/">
            <img src="/assets/images/icons/spp-logo.svg" alt="SPP Logo" className="site-header__logo__graphic" />
          </Link>
        </div>

        <div className={`site-header__menu-icon ${isMenuOpen ? "site-header__menu-icon--close-x" : ""}`} onClick={toggleMenu}>
          <div className="site-header__menu-icon__middle"></div>
        </div>

        <nav className={`site-header__menu-content primary-nav primary-nav--pull-right ${isMenuOpen ? "site-header__menu-content--is-visible" : ""}`}>
          <ul>
            <li>
              <Link to="/home" className="primary-nav__link">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about-us" className="primary-nav__link">
                About
              </Link>
            </li>
            <li>
              <Link to="/terms" className="primary-nav__link">
                Terms
              </Link>
            </li>
            {!appState.loggedIn && (
              <li>
                <button onClick={openModal} className="primary-nav__link">
                  Sign In
                </button>
              </li>
            )}
            <li>{appState.loggedIn ? <HeaderLoggedIn /> : null}</li>
          </ul>
        </nav>
      </div>

      {isModalOpen && !appState.loggedIn && (
        <div className="modal modal--is-visible" onKeyDown={handleKeyPress} tabIndex="0">
          <div className="modal__inner">
            <h2 className="section-title section-title--green section-title--less-margin">Sign In</h2>
            <div className="wrapper wrapper--narrow">
              <HeaderLoggedOut closeModal={closeModal} />
            </div>
            <div className="modal__close" onClick={closeModal} role="button" aria-label="Close modal">
              X
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
