import React, { useContext, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import StateContext from "../context/StateContext";
import LoadingDotsIcon from "./LoadingDotsIcon";

function AboutHistory() {
  const appState = useContext(StateContext);
  const { list: historicProducts, loading, error } = appState.historicProducts;
  const { urls } = appState;

  const [productImages, setProductImages] = useState({});

  // Simplified image fetching, consistent with ProductSlider
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
    return (
      <div className="swiper-container-wrapper">
        <LoadingDotsIcon />
      </div>
    );
  }
  if (error) {
    return <div className="swiper-container-wrapper">{error}</div>;
  }
  if (!historicProducts || historicProducts.length === 0) {
    return (
      <div className="swiper-container-wrapper">No historic items found.</div>
    );
  }

  return (
    // Use the common wrapper class for consistent styling
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
            /*1020: { slidesPerView: 3, spaceBetween: 30 },*/
          }}
        >
          {historicProducts.map((product) => (
            <SwiperSlide key={product.id}>
              {/* Use the common, trusted class name for the card */}
              <div className="swiper-slide__card">
                <img
                  src={
                    productImages[product.id]?.img_path
                      ? `${urls.images}${productImages[product.id].img_path}`
                      : "/assets/images/default.jpg" // Fallback image
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
  );
}

export default AboutHistory;
