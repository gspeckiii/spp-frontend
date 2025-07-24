// /app/components/Home.js (THE FINAL, WORKING VERSION)

import React from "react";
import Page from "./Page"; // We use Page for the overall structure and title
import CategorySlider from "./CategorySlider";

function HomeGuest(props) {
  return (
    // Use the Page component WITHOUT the 'wide' prop.
    // This provides the narrow container for your text content.
    <Page title="Home">
      <div className="full-width-section">
        <CategorySlider />
      </div>
    </Page>
  );
}

export default HomeGuest;
