// Home.js (FINAL, SIMPLIFIED)

import React from "react";
import CategorySlider from "./CategorySlider";

function Home() {
  return (
    <>
      <h1 className="container__heading--animated">Where Truth Takes Form</h1>

      {/* 
        The CategorySlider now handles its own loading. We can just
        render it directly without any conditional checks.
      */}
      <CategorySlider />
    </>
  );
}

export default Home;
