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
    <div className="form__group">
      <button onClick={handleLogOut} className="form__button">
        Sign Out
      </button>
    </div>
  );
}

export default HeaderLoggedIn;
