import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import DispatchContext from "../context/DispatchContext.js";
import StateContext from "../context/StateContext.js";
function HeaderLoggedIn(props) {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  function handleLogOut() {
    appDispatch({ type: "logOut" });

    window.location = "/";
  }
  return (
    <div>
      <div className="site-header__btn-container">
        <button onClick={handleLogOut} className="primary-nav__btn">
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default HeaderLoggedIn;
