// app/components/AboutFamily.js (THE FINAL, CORRECTED VERSION)

import React, { useEffect } from "react";
// We no longer need the Page component for this layout.

function AboutFamily() {
  useEffect(() => {
    document.title = "Family Photos | SPP";
    window.scrollTo(0, 0);
  }, []);

  const imageFiles = [
    /* ... your long list of images is unchanged ... */ "anne-me-78.png",
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
  const portraitImages = imageFiles.filter(
    (filename) => !filename.includes("-landscape")
  );
  const landscapeImages = imageFiles.filter((filename) =>
    filename.includes("-landscape")
  );

  return (
    /* 
      THE FIX: The <Page> wrapper is removed. The .image-grid-container
      is now the top-level element, fixing the layout bug.
    */
    <div className="image-grid-container">
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
  );
}

export default AboutFamily;
