// HomeGuest.js (FINAL, SIMPLIFIED)

import React from "react";
import { Link } from "react-router-dom";
import CategorySlider from "./CategorySlider";

function HomeGuest() {
  return (
    <>
      <h1 className="container__heading--animated">Where Truth Takes Form</h1>

      {/* 
        The CategorySlider now handles its own loading. We can just
        render it directly without any conditional checks.
      */}
      <CategorySlider />

      <div className="container__wrapper--narrow">
        <Link className="form__button" to="/register">
          Register
        </Link>
      </div>
    </>
  );
}

export default HomeGuest;
