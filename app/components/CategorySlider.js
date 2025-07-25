import React, { useContext, useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import StateContext from "../context/StateContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import LoadingDotsIcon from "./LoadingDotsIcon";

function CategorySlider() {
  const appState = useContext(StateContext);
  const { urls, categories } = appState;
  const [productCounts, setProductCounts] = useState({});
  const localCategories = useMemo(
    () => categories.list || [],
    [categories.list]
  );

  useEffect(() => {
    // This useEffect remains the same. It correctly fetches the counts for all categories.
    if (localCategories.length === 0 || !urls.api) return;

    const fetchProductCounts = async () => {
      const promises = localCategories.map(async (category) => {
        if (!category.cat_id) return [category.cat_id, 0];
        try {
          const response = await fetch(
            `${urls.api}/products/category/${category.cat_id}`
          );
          if (response.ok) {
            const products = await response.json();
            return [
              category.cat_id,
              Array.isArray(products) ? products.length : 0,
            ];
          }
          return [category.cat_id, 0];
        } catch (error) {
          console.error(
            `Error fetching products for category ${category.cat_id}:`,
            error.message
          );
          return [category.cat_id, 0];
        }
      });

      const results = await Promise.all(promises);
      const counts = Object.fromEntries(results);
      setProductCounts(counts);
    };

    fetchProductCounts();
  }, [localCategories, urls.api]);

  if (categories.loading) {
    return (
      <div className="swiper-container-wrapper">
        <LoadingDotsIcon />
      </div>
    );
  }

  // This check is fine. If there are no categories from the API, show this.
  if (localCategories.length === 0) {
    return (
      <div className="swiper-container-wrapper">No categories available</div>
    );
  }

  // ====================================================================
  // === CHANGE IS HERE: Create the final list of categories to display ===
  // ====================================================================
  const displayCategories = localCategories.filter((category) => {
    // We will check three conditions to see if a category should be displayed.

    // Condition 1: The category must have an image path.
    const hasImage = category.cat_img_path;

    // Condition 2: The category must NOT be historic.
    // (Assuming the property from your database is called 'historic' and is a boolean)
    const isNotHistoric = !category.historic;

    // Condition 3: The category must have more than 0 products.
    // We check the productCounts state we fetched earlier.
    const hasProducts = productCounts[category.cat_id] > 0;

    // Only if all three conditions are true, we include it in our final list.
    return hasImage && isNotHistoric && hasProducts;
  });

  // Now, we check if our FINAL list is empty. This could be because all categories
  // had no products, or no images, etc.
  if (displayCategories.length === 0) {
    return (
      <div className="swiper-container-wrapper">
        {/* We can show a more specific message if we want */}
        No active categories to display at this time.
      </div>
    );
  }

  return (
    <div className="swiper-container-wrapper">
      <Swiper
        modules={[Navigation]}
        spaceBetween={10}
        slidesPerView={1}
        navigation
        className="swiper"
        breakpoints={{
          730: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 30 },
        }}
      >
        {/* We now map over our new, filtered `displayCategories` list */}
        {displayCategories.map((category) => (
          <SwiperSlide key={category.cat_id}>
            <div className="swiper-slide__card">
              <img
                src={
                  category.cat_img_path
                    ? `${urls.images}${category.cat_img_path}`
                    : "/assets/images/default.jpg"
                }
                alt={category.cat_name || "Category"}
                className="swiper-slide__image"
                onError={(e) => {
                  e.target.src = "/assets/images/default.jpg";
                }}
              />
              <div className="swiper-slide__content">
                <div className="swiper-slide__main-content">
                  <Link
                    to={`/category/${category.cat_id}/products`}
                    className="swiper-slide__link"
                  >
                    <h3 className="swiper-slide__title">
                      {category.cat_name || "Unknown"}
                    </h3>
                    {category.cat_desc && (
                      <p className="swiper-slide__subtitle">
                        {category.cat_desc}
                      </p>
                    )}
                  </Link>
                </div>

                <div className="swiper-slide__footer">
                  {category.cat_vid ? (
                    <a
                      href={category.cat_vid}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="swiper-slide__youtube"
                    >
                      <img
                        src="/assets/images/icons/youtube.svg"
                        alt="Watch on YouTube"
                        className="swiper-slide__youtube-icon"
                      />
                    </a>
                  ) : (
                    <div className="swiper-slide__youtube-placeholder"></div>
                  )}
                  <Link
                    to={`/category/${category.cat_id}/products`}
                    className="swiper-slide__product-count-circle"
                  >
                    {/* The count will always be greater than 0 here */}
                    {productCounts[category.cat_id]}
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default CategorySlider;
