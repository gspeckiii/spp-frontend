// HomeGuest.js (THE FINAL, CORRECTED VERSION WITH LOADING STATE)

import React, { useContext } from "react"; // Import useContext
import { Link } from "react-router-dom";
import StateContext from "../context/StateContext"; // Import context
import CategorySlider from "./CategorySlider";
import LoadingDotsIcon from "./LoadingDotsIcon"; // Import the spinner

function HomeGuest() {
  // Access the global application state
  const appState = useContext(StateContext);

  return (
    <>
      <h1 className="container__heading--animated">Where Truth Takes Form</h1>

      {/* 
        !!! THIS IS THE SAME FIX, APPLIED HERE !!!
        This conditional rendering ensures the spinner is shown during the
        initial data fetch, preventing the text flash.
      */}
      {appState.categories.loading ? (
        <div className="container__centering-wrapper">
          <LoadingDotsIcon />
        </div>
      ) : (
        <CategorySlider />
      )}

      <div className="container__wrapper--narrow">
        <Link className="form__button" to="/register">
          Register
        </Link>
      </div>
    </>
  );
}

export default HomeGuest;
