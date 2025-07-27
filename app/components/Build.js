// /app/components/Build.js (Complete New Component)

import React, { useEffect } from "react";

function Build() {
  // Set the page title and scroll to the top for a consistent user experience
  useEffect(() => {
    document.title = "The Build Process | SPP";
    window.scrollTo(0, 0);
  }, []);

  const imageFiles = [
    "02a6e9bdcac290df85edc11e03072e14-cc_ft_768.webp",
    "06fc9c19a52dc5a5e471415041cb7b2f-cc_ft_384.webp",
    "0eef4e308f4a236466d1bd68b731ef31-cc_ft_384.webp",
    "24cc21e1ea9dc30d52553746ad1d2d5f-cc_ft_384.webp",
    "29801242bbb3085dae9ae9d32c7afd55-cc_ft_384.webp",
    "30e5fb8471ab92bdb157fa87404f2eb7-cc_ft_768.webp",
    "3881d8deee47561a5d4f077ca6b321a2-cc_ft_384.webp",
    "39e936c3dddec63c54fd0d23cc6809d5-cc_ft_768.webp",
    "3a214261b3977af50282530b1dda77ac-cc_ft_384.webp",
    "5dcba43c274d947ce179a5fa13649e1e-cc_ft_384.webp",
    "609b7e50f57f32bbaa0c8cb91eaeef30-cc_ft_768.webp",
    "629eebbf4aa705f37e6d106954161512-cc_ft_384.webp",
    "684a8c5763c7b5617af40c4b6e604423-cc_ft_768.webp",
    "689b4891c1b191e689100c7b2df8894b-cc_ft_384.webp",
    "695994d68204f405989c166ca522ad50-cc_ft_768.webp",
    "6b2cc2184f990e10f944d99a46f79285-cc_ft_384.webp",
    "6dd5f73382f056713dd0416551b9612d-cc_ft_768.webp",
    "6ffa3e1eccd6e3509fc7ef7a252ac509-cc_ft_384.webp",
    "70c44c5c98140d027fdb05fd141bc85b-cc_ft_384.webp",
    "7f8752e8eeeffad3070dfeb0e49fdbf3-cc_ft_384.webp",
    "8fbf3cda378b3517ce93c5a8ac9235fc-cc_ft_384.webp",
    "91de79006a7db23c987b4503bb48b76b-cc_ft_384.webp",
    "943c3796bb097787957bc788e4a0647f-cc_ft_768.webp",
    "948622a68135f1add8c28e0b9f0fb1d7-cc_ft_768.webp",
    "9c4d13cb31a39116395aa0efd7971bcf-cc_ft_384.webp",
    "a4f95ed133a882cf2fb1893e0b42fdda-cc_ft_384.webp",
    "a815e13e8430dd71ffabfc3a81dc9376-cc_ft_768.webp",
    "adf00e076c472dd0cad1f01c645838d2-cc_ft_384.webp",
    "b204d843652ebda465a20fdc18c7c59c-cc_ft_384.webp",
    "b28318e1183847f551cb01e306629a1e-cc_ft_384.webp",
    "bb3374a5118d7cd952af274a94077243-cc_ft_384.webp",
    "ca294fbc9cfb123e8914c9d39aad79e5-cc_ft_384.webp",
    "cd6a87ba2470fee6d6993ad774d69129-cc_ft_384.webp",
    "cf3f45f3618f0a8344f30f9f22e41bff-cc_ft_768.webp",
    "d63f22ba173749e624951e6b94e6457a-cc_ft_384.webp",
    "dfb1135eedbd175fd89fdf998addc065-cc_ft_768.webp",
    "e07b6f04e90c708fb127767f907433ff-cc_ft_384.webp",
    "e09e89ed287f81eaf0c9902ac864f830-cc_ft_768.webp",
    "e141d7b858d4fed9aea6f1bdaa64bd3e-cc_ft_384.webp",
    "eab9195985cf6726e964cda45b13f645-cc_ft_768.webp",
  ];

  // We separate the images into two groups based on their filename
  // to use our existing portrait and landscape grid styles.
  const portraitImages = imageFiles.filter((filename) =>
    filename.includes("-cc_ft_768")
  );
  const landscapeImages = imageFiles.filter((filename) =>
    filename.includes("-cc_ft_384")
  );

  return (
    <>
      <h1 className="container__heading--animated">Custom Home Build</h1>

      <div className="image-grid-container">
        {/* --- Portrait Images Section --- */}
        <div className="image-grid image-grid--portrait">
          {portraitImages.map((filename, index) => (
            <div key={`portrait-${index}`} className="image-grid__item">
              <img
                src={`../assets/images/home/${filename}`}
                alt={`Build process step ${index + 1}`}
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
                src={`../assets/images/home/${filename}`}
                alt={`Build process detail ${index + 1}`}
                className="image-grid__img"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Build;
