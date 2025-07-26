// HomeGuest.js (Final, Cleaned-Up Version)

import React from "react";
import { Link } from "react-router-dom";
import CategorySlider from "./CategorySlider";

function HomeGuest() {
  return (
    <>
      <h1 className="container__heading--animated">Where Truth Takes Form</h1>

      <CategorySlider />

      <div className="container__wrapper--narrow">
        {/* The inline style has been removed. All styling is now in the CSS. */}
        <Link className="form__button" to="/register">
          Register
        </Link>
      </div>
    </>
  );
}

export default HomeGuest;
