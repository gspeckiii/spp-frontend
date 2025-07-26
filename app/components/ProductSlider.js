// ProductSlider.js (FINAL, WITH DYNAMIC HEADING)

import React, { useState, useEffect, useMemo, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Page from "./Page";
import StateContext from "../context/StateContext";
import LoadingDotsIcon from "./LoadingDotsIcon";

function ProductSlider() {
  const { id } = useParams(); // 'id' is the category ID
  const appState = useContext(StateContext);
  const navigate = useNavigate();
  const { urls } = appState;

  // --- NEW STATE FOR THE CATEGORY NAME ---
  const [categoryName, setCategoryName] = useState("");

  const [products, setProducts] = useState([]);
  const [productImages, setProductImages] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // We update the document title dynamically once we have the category name.
    if (categoryName) {
      document.title = `${categoryName} Products | SPP`;
    } else {
      document.title = "Products | SPP";
    }
    window.scrollTo(0, 0);
  }, [categoryName]); // Re-run this effect when the categoryName changes.

  useEffect(() => {
    if (!urls.api) return;

    const fetchCategoryAndProducts = async () => {
      setIsLoading(true);
      try {
        // We now use Promise.all to fetch both data points at the same time.
        const [productsResponse, categoryResponse] = await Promise.all([
          fetch(`${urls.api}/products/category/${id}`),
          fetch(`${urls.api}/categories/${id}`),
        ]);

        // Process Products
        if (productsResponse.ok) {
          const fetchedProducts = await productsResponse.json();
          setProducts(Array.isArray(fetchedProducts) ? fetchedProducts : []);
        } else {
          throw new Error(
            `Failed to load products: ${productsResponse.statusText}`
          );
        }

        // Process Category Name
        if (categoryResponse.ok) {
          const categoryData = await categoryResponse.json();
          setCategoryName(categoryData.cat_name || "this"); // Set a fallback
        } else {
          setCategoryName("this"); // Set a fallback if the fetch fails
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

  // All other useEffects and handlers are correct and remain unchanged.
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

  // Loading and error states are unchanged
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

  // --- JSX CHANGES ARE HERE ---
  return (
    <>
      {/* 
        NEW DYNAMIC HEADING
        We use the same animated heading class from the home page for consistency.
      */}
      <h1 className="container__heading--animated">
        The {categoryName} Collection
      </h1>

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
                  <div className="product-slide__footer">
                    {product.prod_cost && (
                      <Link
                        to={`/order/${product.id}`}
                        state={{ product: product }}
                        onClick={(e) => handleOrderClick(e, product)}
                        className="product-slide__cost-button"
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
