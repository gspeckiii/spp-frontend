// Home.js (THE FINAL, CORRECTED VERSION WITH LOADING STATE)

import React, { useContext } from "react";
import StateContext from "../context/StateContext"; // Import context
import CategorySlider from "./CategorySlider";
import LoadingDotsIcon from "./LoadingDotsIcon"; // Import the spinner

function Home() {
  // Access the global application state
  const appState = useContext(StateContext);

  return (
    <>
      <h1 className="container__heading--animated">Where Truth Takes Form</h1>

      {/* 
        !!! THIS IS THE FIX !!!
        We now check the loading state for categories BEFORE rendering the slider.
        If it's loading, we show a centered spinner.
        If it's not loading, we show the slider component.
        This prevents the "No categories" text from ever flashing.
      */}
      {appState.categories.loading ? (
        <div className="container__centering-wrapper">
          <LoadingDotsIcon />
        </div>
      ) : (
        <CategorySlider />
      )}
    </>
  );
}

export default Home;
