import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import HeaderLoggedOut from "./HeaderLoggedOut";
import HeaderLoggedIn from "./HeaderLoggedIn";
import StateContext from "../context/StateContext";

function Header() {
  const appState = useContext(StateContext);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 800);
  const [isInitialMobileLoad, setIsInitialMobileLoad] = useState(true);

  // Effect 1: Handles the initial 1-second animation ONCE on mobile.
  useEffect(() => {
    // Only run this logic if we load on a mobile screen
    if (!isDesktop) {
      const timer = setTimeout(() => {
        setIsInitialMobileLoad(false);
      }, 1000);

      // Cleanup the timer if the component unmounts during that 1 second
      return () => clearTimeout(timer);
    }
    // If we load on desktop, make sure the initial state is false.
    setIsInitialMobileLoad(false);
  }, []); // Empty array ensures this runs ONLY ONCE on mount.

  // Effect 2: Tracks the scroll position. (This was already correct).
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Effect 3: Tracks if the screen is desktop-sized.
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 800);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Effect 4: Manages the body class for the overlay. (This was already correct).
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

  // === FINAL LOGIC ===
  // The logo is large under two conditions:
  // 1. We are on a desktop screen AND we are not scrolled.
  // 2. We are on a mobile screen AND it's the initial 1-second load AND we are not scrolled.
  const showLargeLogo =
    (isDesktop && !isScrolled) ||
    (!isDesktop && isInitialMobileLoad && !isScrolled);

  return (
    <>
      <header
        className={`site-header ${
          isOverlayOpen ? "site-header--is-expanded" : ""
        } ${isScrolled ? "site-header--is-scrolled" : ""}`}
      >
        <div className="wrapper">
          <div
            className={`site-header__logo ${
              showLargeLogo ? "site-header__logo--large" : ""
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
                <Link to="/" className="primary-nav__link">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about-artist" className="primary-nav__link">
                  Artist
                </Link>
              </li>
              <li>
                <Link to="/about-engineer" className="primary-nav__link">
                  Engineer
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
        {/* ... The rest of your JSX is correct and unchanged ... */}
        {appState.loggedIn ? (
          <nav className="mobile-overlay__nav">
            <ul>
              <li>
                <Link
                  to="/"
                  className="primary-nav__link"
                  onClick={toggleOverlay}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about-artist"
                  className="primary-nav__link"
                  onClick={toggleOverlay}
                >
                  Artist
                </Link>
              </li>
              <li>
                <Link
                  to="/about-engineer"
                  className="primary-nav__link"
                  onClick={toggleOverlay}
                >
                  Engineer
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
            <div>
              <HeaderLoggedOut closeModal={toggleOverlay} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Header;
