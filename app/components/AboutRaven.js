// app/components/AboutRaven.js

import React from "react";
import Page from "./Page";

function AboutRaven() {
  // The complete list of your image filenames
  const ravenImageFiles = [
    "IMG_2302.JPEG",
    "IMG_3094.JPEG",
    "IMG_4053.JPEG",
    "IMG_5210.JPEG",
    "IMG_5668.JPEG",
    "IMG_2342.JPEG",
    "IMG_3185.JPEG",
    "IMG_4137.JPEG",
    "IMG_5259.JPEG",
    "IMG_5677.JPEG",
    "IMG_2407.JPEG",
    "IMG_3192.JPEG",
    "IMG_4171.JPEG",
    "IMG_5279.JPEG",
    "IMG_5758.JPEG",
    "IMG_2456.JPEG",
    "IMG_3206.JPEG",
    "IMG_4177.JPEG",
    "IMG_5347.JPEG",
    "IMG_5909.JPEG",
    "IMG_2532.JPEG",
    "IMG_3225.JPEG",
    "IMG_4314.JPEG",
    "IMG_5427.JPEG",
    "IMG_5950.JPEG",
    "IMG_2566.JPEG",
    "IMG_3275.JPEG",
    "IMG_4704.JPEG",
    "IMG_5471.JPEG",
    "IMG_6035.JPEG",
    "IMG_2757.JPEG",
    "IMG_3359.JPEG",
    "IMG_4731.JPEG",
    "IMG_5535.JPG",
    "IMG_6151.JPEG",
    "IMG_2954.JPEG",
    "IMG_3384.JPEG",
    "IMG_4787.JPEG",
    "IMG_5536.JPG",
    "IMG_6181.JPEG",
    "IMG_3042.JPEG",
    "IMG_3826.JPEG",
    "IMG_4826.JPEG",
    "IMG_5631.JPEG",
    "IMG_6192.JPEG",
    "IMG_3065.JPEG",
    "IMG_3996.JPEG",
    "IMG_5131.JPEG",
    "IMG_5653.JPEG",
  ];

  return (
    <Page title="About Raven">
      <div className="image-grid-container">
        {/* We use the --portrait modifier class to trigger the correct column layout */}
        <div className="image-grid image-grid--portrait">
          {ravenImageFiles.map((filename, index) => (
            <div key={index} className="image-grid__item">
              <img
                // The path points to the new /raven/ subdirectory
                src={`../assets/images/raven/${filename}`}
                alt={`Raven photo ${index + 1}`}
                className="image-grid__img"
              />
            </div>
          ))}
        </div>
      </div>
    </Page>
  );
}

export default AboutRaven;
