// HeaderLoggedIn.js (FINAL, SIMPLIFIED)

import React from "react";
import { Link } from "react-router-dom";
// We no longer need DispatchContext here

function HeaderLoggedIn(props) {
  // --- THIS IS THE FIX, PART 2 ---
  // The component receives the onLogOut function from its parent.
  // When the button is clicked, it simply calls that function.

  if (props.isMobile) {
    return (
      <>
        <li>
          <Link to="/profile-orders" onClick={props.closeModal}>
            Profile
          </Link>
        </li>
        <li>
          <button onClick={props.onLogOut} className="form__button">
            Sign Out
          </button>
        </li>
      </>
    );
  }

  // Desktop view
  return (
    <>
      <Link to="/profile-orders">Profile</Link>
      <div className="form__group">
        <button onClick={props.onLogOut} className="form__button">
          Sign Out
        </button>
      </div>
    </>
  );
}

export default HeaderLoggedIn;
