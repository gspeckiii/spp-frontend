// app/components/AboutFamily.js

import React, { useContext } from "react";
import Page from "./Page";
import StateContext from "../context/StateContext";

function AboutFamily() {
  const appState = useContext(StateContext);

  const imageFiles = [
    "anne-me-78.png",
    "beer-me-78.png",
    "cousins-landscape.png",
    "darcie-grandpa-landscape.png",
    "darcie-jason-me.png",
    "darcie-jason-me-ranch.png",
    "father-son-landscape.png",
    "football.png",
    "grandma-me-landscape.png",
    "grandpa-peck-78.png",
    "horse-me-landscape.png",
    "me-horse-78.png",
    "mother-father-landscape.png",
    "sister-brother-landscape.png",
    "virgina-me-landscape.png",
  ];

  // === THE FIX: Separate images into two distinct groups ===
  const portraitImages = imageFiles.filter(
    (filename) => !filename.includes("-landscape")
  );
  const landscapeImages = imageFiles.filter((filename) =>
    filename.includes("-landscape")
  );

  return (
    <Page title="Family Photos">
      <div className="container">
        <div className="image-grid-container">
          {/* --- Portrait Images Section --- */}
          <div className="image-grid image-grid--portrait">
            {portraitImages.map((filename, index) => (
              <div key={index} className="image-grid__item">
                <img
                  src={`../assets/images/family/${filename}`}
                  alt={`Family portrait ${index + 1}`}
                  className="image-grid__img"
                />
              </div>
            ))}
          </div>

          {/* --- Landscape Images Section --- */}
          <div className="image-grid image-grid--landscape">
            {landscapeImages.map((filename, index) => (
              <div key={index} className="image-grid__item">
                <img
                  src={`../assets/images/family/${filename}`}
                  alt={`Family landscape ${index + 1}`}
                  className="image-grid__img"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Page>
  );
}

export default AboutFamily;
