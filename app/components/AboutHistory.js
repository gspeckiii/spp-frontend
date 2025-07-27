// AboutHistory.js (FINAL, WITH DYNAMIC SLIDER CONFIGURATION)

import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import StateContext from "../context/StateContext";
import LoadingDotsIcon from "./LoadingDotsIcon";

function AboutHistory() {
  // ... all your state and data fetching logic is correct and unchanged ...
  const appState = useContext(StateContext);
  const { list: historicProducts, loading, error } = appState.historicProducts;
  const { urls } = appState;
  const [productImages, setProductImages] = useState({});
  useEffect(() => {
    document.title = "Historical Works | SPP";
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if (!historicProducts || historicProducts.length === 0 || !urls.api) return;
    const fetchProductImages = async () => {
      const images = {};
      const imagePromises = historicProducts.map(async (product) => {
        if (!product.id) return;
        try {
          const response = await fetch(
            `${urls.api}/products/${product.id}/images`
          );
          if (response.ok) {
            const fetchedImages = await response.json();
            images[product.id] =
              Array.isArray(fetchedImages) && fetchedImages.length > 0
                ? { img_path: fetchedImages[0].img_path }
                : { img_path: null };
          } else {
            images[product.id] = { img_path: null };
          }
        } catch (error) {
          console.error(
            `Failed to fetch image for historic product ${product.id}`,
            error
          );
          images[product.id] = { img_path: null };
        }
      });
      await Promise.all(imagePromises);
      setProductImages(images);
    };
    fetchProductImages();
  }, [historicProducts, urls.api]);

  if (loading)
    return (
      <div className="container__centering-wrapper">
        <LoadingDotsIcon />
      </div>
    );
  if (error) return <div className="container__centering-wrapper">{error}</div>;
  if (!historicProducts || historicProducts.length === 0)
    return (
      <div className="container__centering-wrapper">
        No historic items found.
      </div>
    );

  // ====================================================================
  // === THE BUG FIX IS HERE ===
  // ====================================================================
  const numProducts = historicProducts.length;

  const swiperProps = {
    modules: [Navigation],
    spaceBetween: 10,
    className: "swiper",
    navigation: numProducts > 1,
    centeredSlides: numProducts < 3,
    slidesPerView: 1,
    breakpoints: {
      730: { slidesPerView: Math.min(numProducts, 2), spaceBetween: 20 },
      1020: { slidesPerView: Math.min(numProducts, 3), spaceBetween: 30 },
    },
  };

  return (
    <>
      <h1 className="container__heading--animated">Historical Works</h1>

      <div className="swiper-container-wrapper">
        <Swiper {...swiperProps}>
          {historicProducts.map((product) => (
            <SwiperSlide key={product.id}>
              {/* ... The content of your slide is unchanged ... */}
              <div className="swiper-slide__card">
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

      <div className="container__wrapper--narrow">
        <Link
          className="form__button"
          to="/about-artist"
          style={{ display: "inline-block", width: "auto", margin: "2rem 0" }}
        >
          About The Artist
        </Link>
      </div>
    </>
  );
}

export default AboutHistory;
