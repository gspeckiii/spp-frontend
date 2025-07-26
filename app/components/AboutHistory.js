// AboutHistory.js (FINAL, WITH HEADING AND BUTTON)

import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link for the new button
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import StateContext from "../context/StateContext";
import LoadingDotsIcon from "./LoadingDotsIcon";

function AboutHistory() {
  const appState = useContext(StateContext);
  const { list: historicProducts, loading, error } = appState.historicProducts;
  const { urls } = appState;

  const [productImages, setProductImages] = useState({});

  // Add this useEffect for page title and scroll consistency
  useEffect(() => {
    document.title = "Historical Works | SPP";
    window.scrollTo(0, 0);
  }, []);

  // Your image fetching useEffect is correct and remains unchanged.
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

  /* --- Rendering Logic --- */
  if (loading) {
    // It's good practice to wrap loading/error states in a consistent layout
    return (
      <div
        className="container container--narrow"
        style={{ textAlign: "center" }}
      >
        <LoadingDotsIcon />
      </div>
    );
  }
  if (error) {
    return (
      <div
        className="container container--narrow"
        style={{ textAlign: "center" }}
      >
        {error}
      </div>
    );
  }
  if (!historicProducts || historicProducts.length === 0) {
    return (
      <div
        className="container container--narrow"
        style={{ textAlign: "center" }}
      >
        No historic items found.
      </div>
    );
  }

  // --- JSX CHANGES ARE HERE ---
  return (
    // Use a React Fragment to return multiple top-level elements
    <>
      {/* 
        NEW HEADING
        We use the same animated heading class from the homepage for a consistent, professional look.
      */}
      <h1 className="container__heading--animated">Historical Art Work</h1>

      {/* The existing slider section remains the same */}
      <div className="full-width-section">
        <div className="swiper-container-wrapper">
          <Swiper
            modules={[Navigation]}
            spaceBetween={10}
            slidesPerView={1}
            navigation
            className="swiper"
            breakpoints={{
              730: { slidesPerView: 2, spaceBetween: 20 },
              1020: { slidesPerView: 3, spaceBetween: 30 },
            }}
          >
            {historicProducts.map((product) => (
              <SwiperSlide key={product.id}>
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
      </div>

      {/* 
        NEW "ABOUT THE ARTIST" BUTTON
        We use the same layout pattern as the other buttons for consistency.
        It's wrapped in our narrow utility class to be centered and normal-sized.
      */}
      <div className="container__wrapper--narrow">
        <Link
          className="form__button"
          to="/about-artist" // Links to the AboutArtist component
          style={{ display: "inline-block", width: "auto", margin: "2rem 0" }}
        >
          About The Artist
        </Link>
      </div>
    </>
  );
}

export default AboutHistory;
