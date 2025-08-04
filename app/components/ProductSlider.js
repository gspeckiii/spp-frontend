// ProductSlider.js (FINAL, WITH COLLAPSIBLE DESCRIPTION)

import React, { useState, useEffect, useMemo, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Page from "./Page";
import StateContext from "../context/StateContext";
import LoadingDotsIcon from "./LoadingDotsIcon";

function ProductSlider() {
  const { id } = useParams();
  const appState = useContext(StateContext);
  const navigate = useNavigate();
  const { urls } = appState;
  const [categoryName, setCategoryName] = useState("");
  const [products, setProducts] = useState([]);
  const [productImages, setProductImages] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ====================================================================
  // === NEW: State for tracking expanded descriptions ===
  // ====================================================================
  const [expanded, setExpanded] = useState({});

  // ====================================================================
  // === NEW: Handler to toggle the description for a specific product ===
  // ====================================================================
  const handleToggleDescription = (productId) => {
    setExpanded((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  useEffect(() => {
    if (categoryName) {
      document.title = `${categoryName} Products | SPP`;
    } else {
      document.title = "Products | SPP";
    }
    window.scrollTo(0, 0);
  }, [categoryName]);

  useEffect(() => {
    if (!urls.api) return;
    const fetchCategoryAndProducts = async () => {
      setIsLoading(true);
      try {
        const [productsResponse, categoryResponse] = await Promise.all([
          fetch(`${urls.api}/products/category/${id}`),
          fetch(`${urls.api}/categories/${id}`),
        ]);
        if (productsResponse.ok) {
          const fetchedProducts = await productsResponse.json();
          setProducts(Array.isArray(fetchedProducts) ? fetchedProducts : []);
        } else {
          throw new Error(
            `Failed to load products: ${productsResponse.statusText}`
          );
        }
        if (categoryResponse.ok) {
          const categoryData = await categoryResponse.json();
          setCategoryName(categoryData.cat_name || "this");
        } else {
          setCategoryName("this");
        }
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to load page data");
        setProducts([]);
        setCategoryName("");
      }
      setIsLoading(false);
    };
    fetchCategoryAndProducts();
  }, [id, urls.api]);

  const memoizedProducts = useMemo(() => products, [products]);

  useEffect(() => {
    if (!urls.api || memoizedProducts.length === 0) return;
    const fetchProductImages = async () => {
      const images = {};
      for (const product of memoizedProducts) {
        if (product.id) {
          try {
            const response = await fetch(
              `${urls.api}/products/${product.id}/images`
            );
            if (response.ok) {
              const fetchedImages = await response.json();
              images[product.id] =
                Array.isArray(fetchedImages) && fetchedImages.length > 0
                  ? {
                      img_path: fetchedImages[0].img_path,
                      img_desc: fetchedImages[0].img_desc || "",
                    }
                  : { img_path: null, img_desc: "" };
            } else {
              images[product.id] = { img_path: null, img_desc: "" };
            }
          } catch (error) {
            images[product.id] = { img_path: null, img_desc: "" };
          }
        }
      }
      setProductImages(images);
    };
    fetchProductImages();
  }, [memoizedProducts, urls.api]);

  const handleOrderClick = (e, product) => {
    if (!appState.loggedIn) {
      e.preventDefault();
      navigate("/");
    }
  };

  if (error)
    return (
      <Page title="Error">
        <div style={{ textAlign: "center" }}>Error: {error}</div>
      </Page>
    );
  if (isLoading)
    return (
      <Page title="Loading...">
        <div style={{ textAlign: "center" }}>
          <LoadingDotsIcon />
        </div>
      </Page>
    );
  if (!products || products.length === 0)
    return (
      <Page title="No Products">
        <div style={{ textAlign: "center" }}>
          No products available for this category
        </div>
      </Page>
    );

  const numProducts = products.length;
  const swiperProps = {
    modules: [Navigation],
    spaceBetween: 10,
    className: "swiper",
    navigation: numProducts > 1,
    centeredSlides: numProducts < 3,
    slidesPerView: 1,
    breakpoints: {
      730: {
        slidesPerView: Math.min(numProducts, 2),
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: Math.min(numProducts, 3),
        spaceBetween: 30,
      },
    },
  };

  return (
    <>
      <h1 className="container__heading--animated">{categoryName}</h1>
      <div className="swiper-container-wrapper">
        <Swiper {...swiperProps}>
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="swiper-slide__card">
                <img
                  src={
                    productImages[product.id]?.img_path
                      ? `${urls.images}${productImages[product.id].img_path}`
                      : "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
                  }
                  alt={product.prod_name || "Product"}
                  className="swiper-slide__image"
                />
                <div className="swiper-slide__content">
                  <div className="swiper-slide__main-content">
                    <h3 className="swiper-slide__title">
                      {product.prod_name || "Unknown"}
                    </h3>
                    {/* === UPDATED: Description is now collapsible === */}
                    <div
                      className={`collapsible-content ${
                        !expanded[product.id] ? "is-collapsed" : ""
                      }`}
                    >
                      {product.prod_desc && (
                        <p className="swiper-slide__description">
                          {product.prod_desc}
                        </p>
                      )}
                      {productImages[product.id]?.img_desc && (
                        <p className="swiper-slide__image-desc">
                          {productImages[product.id].img_desc}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* === UPDATED: Footer layout with new button === */}
                  <div className="product-slide__footer">
                    {product.prod_desc && (
                      <button
                        onClick={() => handleToggleDescription(product.id)}
                        className="swiper-slide__about-button"
                      >
                        {expanded[product.id] ? "Hide" : "About"}
                      </button>
                    )}
                    {product.prod_cost && (
                      <Link
                        to={`/order/${product.id}`}
                        state={{ product: product }}
                        onClick={(e) => handleOrderClick(e, product)}
                        className="swiper-slide__about-button"
                      >
                        ${parseFloat(product.prod_cost).toFixed(2)}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="container__wrapper--narrow">
        <Link
          className="form__button"
          to="/"
          style={{ display: "inline-block", width: "auto", margin: "2rem 0" }}
        >
          Collections
        </Link>
      </div>
    </>
  );
}

export default ProductSlider;
