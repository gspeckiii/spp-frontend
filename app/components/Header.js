// Header.js (FINAL, REFACTORED)

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

  // --- All your useEffect hooks for logic are correct and remain unchanged ---
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

      {/* This is the desktop navigation. Class name is now simpler. */}
      <nav className="site-header__nav-desktop">
        <ul>
          <li>
            <Link to="/about-artist">Artist</Link>
          </li>
          <li>
            <Link to="/about-engineer">Engineer</Link>
          </li>
          <li>
            {appState.loggedIn ? <HeaderLoggedIn /> : <HeaderLoggedOut />}
          </li>
        </ul>
      </nav>

      {/* The mobile menu icon */}
      <div
        className={`site-header__menu-icon ${
          isOverlayOpen ? "site-header__menu-icon--close-x" : ""
        }`}
        onClick={toggleOverlay}
      >
        <div className="site-header__menu-icon__middle"></div>
      </div>

      {/* 
        !!! BUG FIX & REFACTOR !!!
        The mobile overlay is now INSIDE the header. This isolates it from the
        main page content and fixes the layout bug. We also use a more specific
        className, and apply the "is-open" class directly.
      */}
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
              <li>
                <Link to="/terms" onClick={toggleOverlay}>
                  Terms
                </Link>
              </li>
              <li>
                <HeaderLoggedIn />
              </li>
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
                <Link to="/terms" onClick={toggleOverlay}>
                  Terms
                </Link>
              </li>
              <li>
                <HeaderLoggedOut closeModal={toggleOverlay} />
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
