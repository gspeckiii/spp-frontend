// Home.js (THE FINAL, CORRECTED VERSION)

import React from "react";
import Page from "./Page";
import CategorySlider from "./CategorySlider";

function Home() {
  return (
    <>
      {/* 
        SECTION 1: The Animated Heading
        Just like in HomeGuest, this is now separate and has no background.
      */}
      <h1 className="container__heading--animated">Where Truth Takes Form</h1>

      {/* 
        SECTION 2: The Full-Width Slider
        This remains a direct child for full-width layout.
      */}
      <CategorySlider />

      {/* No other content is needed for the logged-in user's home page */}
    </>
  );
}

export default Home;
