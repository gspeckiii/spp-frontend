import React, { useState, useContext, useEffect } from "react"
import { Link } from "react-router-dom"
import HeaderLoggedOut from "./HeaderLoggedOut"
import HeaderLoggedIn from "./HeaderLoggedIn"
import StateContext from "../StateContext"

function Header() {
  const appState = useContext(StateContext)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLargeLogo, setIsLargeLogo] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLargeLogo(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const toggleMenu = () => {
    if (!appState.loggedIn) {
      setIsModalOpen(true) // Open login modal directly for logged-out users
    } else {
      setIsMenuOpen(!isMenuOpen) // Toggle mobile menu for logged-in users
    }
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
    <>
      <header className={`site-header ${isMenuOpen ? "site-header--is-expanded" : ""}`}>
        <div className="wrapper">
          <div className={`site-header__logo ${isLargeLogo ? "site-header__logo--large" : ""}`}>
            <Link to="/">
              <img src="/assets/images/icons/spp-logo.svg" alt="SPP Logo" className="site-header__logo__graphic" />
            </Link>
          </div>

          <div className={`site-header__menu-icon ${isMenuOpen ? "site-header__menu-icon--close-x" : ""}`} onClick={toggleMenu}>
            <div className="site-header__menu-icon__middle"></div>
          </div>
        </div>
      </header>

      {isMenuOpen && appState.loggedIn && (
        <nav className={`mobile-menu primary-nav primary-nav--pull-right ${isMenuOpen ? "mobile-menu--is-visible" : ""}`}>
          <ul>
            <li>
              <Link to="/home" className="primary-nav__link" onClick={toggleMenu}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/about-us" className="primary-nav__link" onClick={toggleMenu}>
                About
              </Link>
            </li>
            <li>
              <Link to="/terms" className="primary-nav__link" onClick={toggleMenu}>
                Terms
              </Link>
            </li>
            <li>
              <HeaderLoggedIn />
            </li>
          </ul>
        </nav>
      )}

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
    </>
  )
}

export default Header
