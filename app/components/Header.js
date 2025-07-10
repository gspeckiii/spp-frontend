import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import HeaderLoggedOut from "./HeaderLoggedOut";
import HeaderLoggedIn from "./HeaderLoggedIn";
import StateContext from "../context/StateContext";

function Header() {
  const appState = useContext(StateContext);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isLargeLogo, setIsLargeLogo] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLargeLogo(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isOverlayOpen) {
      document.body.classList.add("overlay-is-open");
    } else {
      document.body.classList.remove("overlay-is-open");
    }
  }, [isOverlayOpen]);

  const toggleOverlay = () => {
    setIsOverlayOpen((prev) => !prev);
  };

  return (
    <>
      <header
        className={`site-header ${
          isOverlayOpen ? "site-header--is-expanded" : ""
        }`}
      >
        <div className="wrapper">
          <div
            className={`site-header__logo ${
              isLargeLogo ? "site-header__logo--large" : ""
            }`}
          >
            <Link to="/">
              <img
                src="/assets/images/icons/spp-logo.svg"
                alt="SPP Logo"
                className="site-header__logo__graphic"
              />
            </Link>
          </div>

          <div
            className={`site-header__menu-icon ${
              isOverlayOpen ? "site-header__menu-icon--close-x" : ""
            }`}
            onClick={toggleOverlay}
          >
            <div className="site-header__menu-icon__middle"></div>
          </div>

          <nav className="primary-nav primary-nav--desktop">
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
                {appState.loggedIn ? (
                  <HeaderLoggedIn />
                ) : (
                  // === THE DEFINITIVE FIX: Restore the inline form for desktop view ===
                  // The <HeaderLoggedOut> component is designed to be this form.
                  // The closeModal prop is for the mobile overlay; for desktop, it does nothing.
                  <HeaderLoggedOut closeModal={() => {}} />
                )}
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div className="mobile-overlay">
        {appState.loggedIn ? (
          <nav className="mobile-overlay__nav">
            <ul>
              <li>
                <Link
                  to="/home"
                  className="primary-nav__link"
                  onClick={toggleOverlay}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about-us"
                  className="primary-nav__link"
                  onClick={toggleOverlay}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="primary-nav__link"
                  onClick={toggleOverlay}
                >
                  Terms
                </Link>
              </li>
              <li>
                <HeaderLoggedIn />
              </li>
            </ul>
          </nav>
        ) : (
          <div className="mobile-overlay__modal-inner">
            <h2 className="section-title section-title--green section-title--less-margin">
              Sign In
            </h2>
            <div className="wrapper wrapper--narrow">
              <HeaderLoggedOut closeModal={toggleOverlay} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Header;
