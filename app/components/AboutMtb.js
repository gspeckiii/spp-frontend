// /app/components/AboutMtb.js (FINAL, REWRITTEN)

import React, { useEffect } from "react";

function AboutMtb() {
  // Updated useEffect for the new page context
  useEffect(() => {
    document.title = "Mountain Biking Photos | SPP";
    window.scrollTo(0, 0);
  }, []);

  const imageFiles = [
    "09282018_ALineTombstone_EMU_189-landscape.jpg",
    "5D5A2CD2-D826-46AC-BEFD-B7A2C82055AA.jpeg",
    "634AD0F8-40A7-4EDB-825A-1FB75D7AE09F-landscape.jpg",
    "6FFA0D56-9BFE-408D-AFF5-C78C432250A4.jpg",
    "80954878-DSC09579-181-landscape.jpg",
    "80958741-GRT-Zuest-FRI-1205-landscape.jpg",
    "846C3046-9CCF-43A0-A100-B350478EFB5C.jpg",
    "928C746A-1ECF-472C-A260-359552F2B3DF-landscape.jpeg",
    "ACAC3783-E427-4F80-BC8D-EC257C1E8995-square.jpeg",
    "DEFAB8B2-201D-4080-86B3-A053311347D4-landscape.jpeg",
    "envictus-Zach.jpg",
    "FA5749BD-2BA6-428F-A916-25A4DFA975CE.JPG",
    "FullSizeRender.jpg",
    "IMG_0324.jpg",
    "IMG_0525.jpg",
    "IMG_0526.jpg",
    "IMG_1113.jpg",
    "IMG_1403.JPEG",
    "IMG_1408.JPEG",
    "IMG_1411.JPEG",
    "IMG_3510.jpg",
    "IMG_3520.jpg",
    "IMG_3527.jpg",
    "IMG_3703-landscape.jpg",
    "IMG_3761.jpeg",
    "IMG_3854.jpeg",
    "IMG_4170.jpg",
    "IMG_4514.jpeg",
    "IMG_4543.jpg",
    "IMG_4728.jpeg",
    "IMG_4784-square.jpeg",
    "IMG_4862-landscape.jpg",
    "IMG_5083.jpg",
    "IMG_5482.jpg",
    "IMG_6848-square.jpg",
    "IMG_8774.JPEG",
    "IMG_8793.jpg",
    "IMG_9071-landscape.jpg",
    "IMG_9309--landscape.jpeg",
    "IMG_9673-landscape.jpg",
    "IMG_9873-landscape.jpg",
    "IMG_9939.jpeg",
    "IMG_9972-landscape.jpeg",
    "karenBham-landscape.jpg",
    "OldPueblo-landscape.jpeg",
    "OldPuebloYellow-landscape.jpg",
    "TrueGrit-landscape.jpg",
  ];

  // --- THE FIX: We now filter into THREE distinct groups ---
  const landscapeImages = imageFiles.filter((filename) =>
    filename.includes("-landscape")
  );
  const squareImages = imageFiles.filter((filename) =>
    filename.includes("-square")
  );
  // Portrait images are any images that are NOT landscape and NOT square.
  const portraitImages = imageFiles.filter(
    (filename) =>
      !filename.includes("-landscape") && !filename.includes("-square")
  );

  return (
    // We add a fragment and a consistent heading
    <>
      <h1 className="container__heading--animated">Mountain Biking</h1>

      <div className="image-grid-container">
        {/* --- Portrait Images Section --- */}
        <div className="image-grid image-grid--portrait">
          {portraitImages.map((filename, index) => (
            <div key={`portrait-${index}`} className="image-grid__item">
              <img
                src={`../assets/images/mtb/${filename}`}
                alt={`MTB portrait ${index + 1}`}
                className="image-grid__img"
              />
            </div>
          ))}
        </div>

        {/* --- Landscape Images Section --- */}
        <div className="image-grid image-grid--landscape">
          {landscapeImages.map((filename, index) => (
            <div key={`landscape-${index}`} className="image-grid__item">
              <img
                src={`../assets/images/mtb/${filename}`}
                alt={`MTB landscape ${index + 1}`}
                className="image-grid__img"
              />
            </div>
          ))}
        </div>

        {/* --- NEW Square Images Section --- */}
        <div className="image-grid image-grid--square">
          {squareImages.map((filename, index) => (
            <div key={`square-${index}`} className="image-grid__item">
              <img
                src={`../assets/images/mtb/${filename}`}
                alt={`MTB square ${index + 1}`}
                className="image-grid__img"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default AboutMtb;
