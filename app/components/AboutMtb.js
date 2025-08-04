// app/components/AboutFamily.js (THE FINAL, CORRECTED VERSION)

import React, { useEffect } from "react";
// We no longer need the Page component for this layout.

function AboutMtb() {
  useEffect(() => {
    document.title = "Family Photos | SPP";
    window.scrollTo(0, 0);
  }, []);

  const imageFiles = [
    "09282018_ALineTombstone_EMU_189-landscape.jpg",
    "634AD0F8-40A7-4EDB-825A-1FB75D7AE09F-landscape.jpg",
    "6FFA0D56-9BFE-408D-AFF5-C78C432250A4.jpg",
    "80954878-DSC09579-181-landscape.jpg",
    "80958741-GRT-Zuest-FRI-1205-landscape.jpg",
    "846C3046-9CCF-43A0-A100-B350478EFB5C.jpg",
    "envictus-Zach.jpg",
    "FullSizeRender.jpg",
    "IMG_0324.jpg",
    "IMG_0525.jpg",
    "IMG_0526.jpg",
    "IMG_1113.jpg",
    "IMG_1403.JPEG",
    "IMG_1408.JPEG",
    "IMG_1411.JPEG",
    "IMG_3510.jpg",
    "IMG_3527.jpg",
    "IMG_4862-landscape.jpg",
    "IMG_5083.jpg",
    "IMG_8793.jpg",
    "IMG_9071-landscape.jpg",
    "IMG_9673-landscape.jpg",
    "IMG_9873-landscape.jpg",
    "karenBham-landscape.jpg",
    "OldPueblo-landscape.jpeg",
    "OldPuebloYellow-landscape.jpg",
    "TrueGrit-landscape.jpg",
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
              src={`../assets/images/mtb/${filename}`}
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
              src={`../assets/images/mtb/${filename}`}
              alt={`Family landscape ${index + 1}`}
              className="image-grid__img"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default AboutMtb;
