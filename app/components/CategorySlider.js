import React, { useContext, useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import StateContext from "../StateContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

function CategorySlider() {
  const { categories } = useContext(StateContext);
  const [productCounts, setProductCounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [localCategories, setLocalCategories] = useState([]);

  const memoizedCategories = useMemo(
    () => categories?.list || [],
    [categories]
  );

  useEffect(() => {
    console.log("CategorySlider mounted");
    const fetchCategories = async () => {
      if (
        memoizedCategories &&
        Array.isArray(memoizedCategories) &&
        memoizedCategories.length > 0
      ) {
        console.log("Using StateContext categories:", memoizedCategories);
        setLocalCategories(memoizedCategories);
        setIsLoading(false);
        return;
      }

      console.log("No categories in StateContext, fetching categories...");
      try {
        const response = await fetch("http://localhost:8080/api/categories");
        if (response.ok) {
          const fetchedCategories = await response.json();
          console.log("Fetched categories:", fetchedCategories);
          setLocalCategories(
            Array.isArray(fetchedCategories) ? fetchedCategories : []
          );
        } else {
          console.error(
            "Failed to fetch categories:",
            response.status,
            response.statusText
          );
          setLocalCategories([]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error.message);
        setLocalCategories([]);
      }
      setIsLoading(false);
    };

    fetchCategories();
    return () => console.log("CategorySlider unmounted");
  }, [memoizedCategories]);

  useEffect(() => {
    const fetchProductCounts = async () => {
      if (
        !localCategories ||
        !Array.isArray(localCategories) ||
        localCategories.length === 0
      ) {
        console.log("No categories to fetch product counts for");
        return;
      }

      console.log("Fetching product counts for categories:", localCategories);
      const counts = {};
      for (const category of localCategories) {
        if (category.cat_id) {
          try {
            const response = await fetch(
              `http://localhost:8080/api/products/category/${category.cat_id}`
            );
            if (response.ok) {
              const products = await response.json();
              console.log(
                `Products for category ${category.cat_id}:`,
                products
              );
              counts[category.cat_id] = Array.isArray(products)
                ? products.length
                : 0;
            } else {
              console.error(
                `Failed to fetch products for category ${category.cat_id}:`,
                response.status,
                response.statusText
              );
              counts[category.cat_id] = 0;
            }
          } catch (error) {
            console.error(
              `Error fetching products for category ${category.cat_id}:`,
              error.message
            );
            counts[category.cat_id] = 0;
          }
        }
      }
      setProductCounts(counts);
      console.log("Updated product counts:", counts);
    };

    fetchProductCounts();
  }, [localCategories]);

  if (isLoading) {
    return (
      <div className="swiper-container-wrapper">Loading categories...</div>
    );
  }

  if (
    !localCategories ||
    !Array.isArray(localCategories) ||
    localCategories.length === 0
  ) {
    console.log("No categories available in localCategories");
    return (
      <div className="swiper-container-wrapper">No categories available</div>
    );
  }

  const categoriesWithImages = localCategories.filter(
    (cat) => cat.cat_img_path
  );

  if (categoriesWithImages.length === 0) {
    console.log("No categories with images in localCategories");
    return (
      <div className="swiper-container-wrapper">
        No category images available
      </div>
    );
  }

  categoriesWithImages.forEach((cat) => {
    console.log(
      `Category ${cat.cat_id} image path: http://localhost:8080/${cat.cat_img_path}`
    );
  });

  return (
    <div className="swiper-container-wrapper">
      <Swiper
        modules={[Navigation]}
        spaceBetween={10}
        slidesPerView={1}
        navigation
        className="swiper"
        breakpoints={{
          // Adjusted breakpoints for better scaling
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 30 },
        }}
      >
        {categoriesWithImages.map((category) => (
          <SwiperSlide key={category.cat_id}>
            <div className="swiper-slide__card">
              <img
                src={
                  category.cat_img_path
                    ? `http://localhost:8080/${category.cat_img_path}`
                    : "http://localhost:8080/assets/images/default.jpg"
                }
                alt={category.cat_name || "Category"}
                className="swiper-slide__image"
                onError={(e) => {
                  e.target.src =
                    "http://localhost:8080/assets/images/default.jpg";
                  console.log(
                    `Image load failed for category ${category.cat_id}: http://localhost:8080/${category.cat_img_path}`
                  );
                }}
              />
              <div className="swiper-slide__content">
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
                        onError={(e) => {
                          e.target.style.display = "none";
                          console.log(
                            `YouTube icon load failed for category ${category.cat_id}`
                          );
                        }}
                      />
                    </a>
                  ) : (
                    <div className="swiper-slide__youtube-placeholder"></div>
                  )}
                  <Link
                    to={`/category/${category.cat_id}/products`}
                    className="swiper-slide__product-count number-in-circle"
                  >
                    {productCounts[category.cat_id] !== undefined
                      ? `${productCounts[category.cat_id]} `
                      : "Loading..."}
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
