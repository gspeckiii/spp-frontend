// === CORRECTED FILE ===
import React, { useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import StateContext from "../context/StateContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import LoadingDotsIcon from "./LoadingDotsIcon";

function CategorySlider() {
  const appState = useContext(StateContext);
  const { urls, categories } = appState;
  const [expanded, setExpanded] = useState({});

  const handleToggleDescription = (categoryId) => {
    setExpanded((prev) => ({ ...prev, [categoryId]: !prev[categoryId] }));
  };

  // === STEP 1: MODIFY THE FILTER LOGIC ===
  // We will now get the "Printful Merch" category from the API.
  // We need to make sure our filter doesn't hide it just because its product count is 0.
  const displayCategories = useMemo(() => {
    return (categories.list || []).filter((category) => {
      const hasImage = !!category.cat_img_path;
      const isPrintfulCat = category.cat_name === "Printful Merch";

      // A category should be displayed if:
      // 1. It has an image, AND
      // 2. It's either the special Printful category OR it has standard products.
      const hasStandardProducts = category.prod_count > 0;

      return hasImage && (isPrintfulCat || hasStandardProducts);
    });
  }, [categories.list]);

  if (categories.loading) {
    return (
      <div className="container__centering-wrapper">
        <LoadingDotsIcon />
      </div>
    );
  }

  if (displayCategories.length === 0) {
    return (
      <div className="container__centering-wrapper">
        No categories with products are available at this time.
      </div>
    );
  }

  const numCategories = displayCategories.length;
  const swiperProps = {
    modules: [Navigation],
    spaceBetween: 10,
    className: "swiper",
    navigation:
      numCategories >
      (window.innerWidth >= 1024 ? 3 : window.innerWidth >= 730 ? 2 : 1),
    slidesPerView: 1,
    breakpoints: {
      730: { slidesPerView: Math.min(numCategories, 2), spaceBetween: 20 },
      1024: { slidesPerView: Math.min(numCategories, 3), spaceBetween: 30 },
    },
  };

  return (
    <div className="swiper-container-wrapper">
      <Swiper {...swiperProps}>
        {/* === STEP 2: REMOVE THE STATIC CARD AND USE THE REAL DATA === */}
        {/* We now map over 'displayCategories' which includes the real Printful category from the API. */}
        {displayCategories.map((category) => {
          // === STEP 3: MAKE LINKS AND TEXT CONDITIONAL ===
          const isPrintful = category.cat_name === "Printful Merch";
          const linkTarget = isPrintful
            ? "/printful-products"
            : `/category/${category.cat_id}/products`;
          const productCountText = isPrintful ? "Shop" : category.prod_count;

          return (
            <SwiperSlide key={category.cat_id}>
              <div className="swiper-slide__card">
                {/* This now uses the real image path from the database for ALL categories */}
                <img
                  src={`${urls.images}${category.cat_img_path}`}
                  alt={category.cat_name}
                  className="swiper-slide__image"
                />
                <div className="swiper-slide__content">
                  <div className="swiper-slide__main-content">
                    <Link to={linkTarget} className="swiper-slide__link">
                      <h3 className="swiper-slide__title">
                        {category.cat_name}
                      </h3>
                    </Link>
                    <div
                      className={`collapsible-content ${
                        !expanded[category.cat_id] ? "is-collapsed" : ""
                      }`}
                    >
                      {category.cat_desc && (
                        <p className="swiper-slide__subtitle">
                          {category.cat_desc}
                        </p>
                      )}
                    </div>
                  </div>
                  {category.cat_desc && (
                    <div className="swiper-slide__footer swiper-slide__footer--centered">
                      <button
                        onClick={() => handleToggleDescription(category.cat_id)}
                        className="swiper-slide__about-button"
                      >
                        {expanded[category.cat_id] ? "Hide" : "About"}
                      </button>
                    </div>
                  )}
                  <div className="swiper-slide__footer">
                    <div className="swiper-slide__youtube-placeholder"></div>{" "}
                    {/* Placeholder */}
                    <Link
                      to={linkTarget}
                      className="swiper-slide__product-count-circle"
                    >
                      {productCountText}
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}

export default CategorySlider;
