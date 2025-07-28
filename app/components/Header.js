// Header.js (THE FINAL, DEFINITIVE, AND CORRECT VERSION)

import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import HeaderLoggedOut from "./HeaderLoggedOut";
import HeaderLoggedIn from "./HeaderLoggedIn";
import StateContext from "../context/StateContext";
import DispatchContext from "../context/DispatchContext";

function Header() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  // ... all your state and useEffect hooks are correct and unchanged ...
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 800);
  const [isInitialMobileLoad, setIsInitialMobileLoad] = useState(true);
  useEffect(() => {
    if (!isDesktop) {
      const timer = setTimeout(() => setIsInitialMobileLoad(false), 1000);
      return () => clearTimeout(timer);
    }
    setIsInitialMobileLoad(false);
  }, []);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 800);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    if (isOverlayOpen) {
      document.body.classList.add("overlay-is-open");
    } else {
      document.body.classList.remove("overlay-is-open");
    }
  }, [isOverlayOpen]);
  const toggleOverlay = () => setIsOverlayOpen((prev) => !prev);
  const showLargeLogo =
    (isDesktop && !isScrolled) ||
    (!isDesktop && isInitialMobileLoad && !isScrolled);
  function handleLogOut() {
    setIsOverlayOpen(false);
    setTimeout(() => {
      appDispatch({ type: "logOut" });
      window.location = "/";
    }, 300);
  }

  return (
    <header
      className={`site-header ${
        isOverlayOpen ? "site-header--is-expanded" : ""
      } ${isScrolled ? "site-header--is-scrolled" : ""}`}
    >
      <div className="site-header__logo-wrapper">
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
      </div>

      {/* --- DESKTOP NAVIGATION --- */}
      <nav className="site-header__nav-desktop">
        <ul>
          {/* 
            !!! THIS IS THE DEFINITIVE FIX !!!
            We ensure that BOTH branches of the conditional rendering return a
            consistent set of <li> elements wrapped in a React Fragment <>.
            This creates a stable and valid HTML structure.
          */}
          {appState.loggedIn ? (
            <>
              {/* Logged-in users see these links */}
              <li>
                <Link to="/about-artist">Artist</Link>
              </li>
              <li>
                <Link to="/about-engineer">Engineer</Link>
              </li>
              <li>
                <HeaderLoggedIn onLogOut={handleLogOut} />
              </li>
            </>
          ) : (
            <>
              {/* Logged-out users see these links */}
              <li>
                <Link to="/about-artist">Artist</Link>
              </li>
              <li>
                <Link to="/about-engineer">Engineer</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
              <li>
                <HeaderLoggedOut />
              </li>
            </>
          )}
        </ul>
      </nav>

      <div
        className={`site-header__menu-icon ${
          isOverlayOpen ? "site-header__menu-icon--close-x" : ""
        }`}
        onClick={toggleOverlay}
      >
        <div className="site-header__menu-icon__middle"></div>
      </div>

      {/* --- MOBILE OVERLAY (This was already correct) --- */}
      <div
        className={`mobile-overlay ${
          isOverlayOpen ? "mobile-overlay--is-open" : ""
        }`}
      >
        {appState.loggedIn ? (
          <nav className="mobile-overlay__nav">
            <ul>
              <li>
                <Link to="/" onClick={toggleOverlay}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about-artist" onClick={toggleOverlay}>
                  Artist
                </Link>
              </li>
              <li>
                <Link to="/about-engineer" onClick={toggleOverlay}>
                  Engineer
                </Link>
              </li>
              <HeaderLoggedIn
                isMobile={true}
                onLogOut={handleLogOut}
                closeModal={toggleOverlay}
              />
            </ul>
          </nav>
        ) : (
          <nav className="mobile-overlay__nav">
            <ul>
              <li>
                <Link to="/" onClick={toggleOverlay}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about-artist" onClick={toggleOverlay}>
                  Artist
                </Link>
              </li>
              <li>
                <Link to="/about-engineer" onClick={toggleOverlay}>
                  Engineer
                </Link>
              </li>
              <li>
                <Link to="/register" onClick={toggleOverlay}>
                  Register
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
