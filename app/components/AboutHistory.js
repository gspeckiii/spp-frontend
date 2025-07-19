import React, { useContext, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Axios from "axios";
import StateContext from "../context/StateContext";
import LoadingDotsIcon from "./LoadingDotsIcon";

/* No longer need to import an isolated stylesheet */

const detectImageOrientation = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () =>
      resolve(img.naturalWidth > img.naturalHeight ? "landscape" : "portrait");
    img.onerror = () => resolve("landscape");
    img.src = url;
  });
};

function AboutHistory() {
  const appState = useContext(StateContext);
  const { list: historicProducts, loading, error } = appState.historicProducts;
  const { urls } = appState;

  const [productImages, setProductImages] = useState({});

  useEffect(() => {
    if (!historicProducts || historicProducts.length === 0 || !urls.api) return;

    const fetchProductImagesAndOrientation = async () => {
      const images = {};
      const requests = historicProducts.map(async (product) => {
        if (!product.id) return;
        try {
          const response = await Axios.get(`/products/${product.id}/images`);
          if (response.data?.[0]?.img_path) {
            const firstImage = response.data[0];
            const fullUrl = `${urls.images}${firstImage.img_path}`;
            const orientation = await detectImageOrientation(fullUrl);
            images[product.id] = { img_path: firstImage.img_path, orientation };
          } else {
            images[product.id] = { img_path: null, orientation: "landscape" };
          }
        } catch (error) {
          images[product.id] = { img_path: null, orientation: "landscape" };
        }
      });
      await Promise.all(requests);
      setProductImages(images);
    };

    fetchProductImagesAndOrientation();
  }, [historicProducts, urls.api, urls.images]);

  /* --- Rendering Logic --- */
  if (loading)
    return (
      <div className="swiper-container-wrapper">
        <LoadingDotsIcon />
      </div>
    );
  if (error) return <div className="swiper-container-wrapper">{error}</div>;
  if (!historicProducts || historicProducts.length === 0)
    return (
      <div className="swiper-container-wrapper">No historic items found.</div>
    );

  return (
    /* === THE FIX: Add a unique wrapper class to scope our new styles === */
    <div className="about-history-slider-wrapper">
      <Swiper
        modules={[Navigation]}
        spaceBetween={30} /* A generous space for a single slide view */
        slidesPerView={1} /* ALWAYS one slide */
        navigation
        className="swiper"
        /* NO breakpoints needed */
      >
        {historicProducts.map((product) => (
          <SwiperSlide key={product.id}>
            {/* Reverting to your global, trusted class names */}
            <div
              className={`swiper-slide__card swiper-slide__card--${
                productImages[product.id]?.orientation || "landscape"
              }`}
            >
              <img
                src={
                  productImages[product.id]?.img_path
                    ? `${urls.images}${productImages[product.id].img_path}`
                    : "/assets/images/default.jpg"
                }
                alt={product.prod_name || "Historic Product"}
                className="swiper-slide__image"
                onError={(e) => {
                  e.target.src = "/assets/images/default.jpg";
                }}
              />
              <div className="swiper-slide__content">
                <h3 className="swiper-slide__title">
                  {product.prod_name || "Untitled"}
                </h3>
                {product.prod_desc && (
                  <p className="swiper-slide__description">
                    {product.prod_desc}
                  </p>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default AboutHistory;
