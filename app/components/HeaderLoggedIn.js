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
        <button onClick={handleLogOut} className="form-controls__button">
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default HeaderLoggedIn;

/*
    <div className="form-controls">
      <Link to={`/profile/${appState.username}`}>
        <img className="site-header__icon" src={appState.user.avatar} />
      </Link>
      <Link to="/orders">
      Orders
      </Link>
     
      <div className="form-controls__group form-controls__group--dark">
        <button onClick={handleLogOut} className="form-controls__button form-controls--small">
          Sign Out
        </button>
      </div>
    </div>

*/
