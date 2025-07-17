import React, { useContext } from "react";
import { Link } from "react-router-dom"; // Importing Link for navigation
import StateContext from "../context/StateContext"; // Import StateContext to access user state

function Footer() {
  const state = useContext(StateContext); // Access the global state

  return (
    <footer className="site-footer">
      <p>
        <Link to="/" className="text-muted white-font">
          {" "}
          Home{" "}
        </Link>{" "}
        |{" "}
        <Link to="/about-engineer" className="">
          Engineer
        </Link>{" "}
        |{" "}
        <Link to="/about-artist" className="">
          Artist
        </Link>{" "}
        |{" "}
        <Link to="/terms" className="">
          Terms
        </Link>
        {state.loggedIn && state.user.admin && (
          <>
            {" | "}
            <Link to="/admin-dashboard" className="">
              Admin Dashboard
            </Link>
          </>
        )}
      </p>
      <p>All rights reserved. Copyright © {new Date().getFullYear()}</p>
    </footer>
  );
}

export default Footer;
