import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import HeaderLoggedOut from "./HeaderLoggedOut";
import HeaderLoggedIn from "./HeaderLoggedIn";
import StateContext from "../context/StateContext";

function Header() {
  const appState = useContext(StateContext);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isLargeLogo, setIsLargeLogo] = useState(true);

  // === CHANGED: Replaced the old useEffect with a new one that handles screen size ===
  useEffect(() => {
    // Define the breakpoint. This should match the value used in your CSS for "@mixin atMedium".
    // 800px is a common value, but adjust if yours is different.
    const MEDIUM_BREAKPOINT = 800;

    // This function sets the logo size based on the current window width.
    const handleResize = () => {
      setIsLargeLogo(window.innerWidth >= MEDIUM_BREAKPOINT);
    };

    // This timer handles the initial "shrink" animation ONLY on small screens.
    let timer;
    if (window.innerWidth < MEDIUM_BREAKPOINT) {
      timer = setTimeout(() => {
        setIsLargeLogo(false);
      }, 1000);
    } else {
      // If we load on a large screen, make sure the logo is large immediately.
      setIsLargeLogo(true);
    }

    // Add an event listener to check the size whenever the window is resized.
    window.addEventListener("resize", handleResize);

    // This is a cleanup function that React runs when the component is unmounted.
    // It's important to prevent memory leaks.
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, []); // The empty dependency array [] means this effect runs only once when the component mounts.
  // === END OF CHANGES ===

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
