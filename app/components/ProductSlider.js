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

  const [products, setProducts] = useState([]);
  const [productImages, setProductImages] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const memoizedProducts = useMemo(() => products, [products]);

  // === Using YOUR working data fetching logic ===
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/products/category/${id}`
        );
        if (response.ok) {
          const fetchedProducts = await response.json();
          setProducts(Array.isArray(fetchedProducts) ? fetchedProducts : []);
          setError(null);
        } else {
          setError(`Failed to load products: ${response.statusText}`);
          setProducts([]);
        }
      } catch (error) {
        setError("Failed to load products");
        setProducts([]);
      }
      setIsLoading(false); // This was a key part of the original logic
    };
    fetchProducts();
  }, [id]);

  useEffect(() => {
    const fetchProductImages = async () => {
      if (!memoizedProducts || memoizedProducts.length === 0) {
        // No need to set loading false here, as the first effect handles it
        return;
      }
      const images = {};
      for (const product of memoizedProducts) {
        if (product.id) {
          try {
            const response = await fetch(
              `http://localhost:8080/api/products/${product.id}/images`
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
  }, [memoizedProducts]);
  // === End of your working data fetching logic ===

  const handleOrderClick = (e, product) => {
    // This is the correct navigation logic
    if (!appState.loggedIn) {
      e.preventDefault();
      navigate("/");
    }
  };

  // The loading/error states
  if (error) {
    return (
      <Page title="Error">
        <div className="swiper-container-wrapper">Error: {error}</div>
      </Page>
    );
  }
  if (isLoading) {
    return (
      <Page title="Loading...">
        <LoadingDotsIcon />
      </Page>
    );
  }
  if (!products || products.length === 0) {
    return (
      <Page title="No Products">
        <div className="swiper-container-wrapper">
          No products available for this category
        </div>
      </Page>
    );
  }

  return (
    <Page title="Products">
      <div className="swiper-container-wrapper">
        <Swiper
          modules={[Navigation]}
          spaceBetween={10}
          slidesPerView={1}
          navigation
          className="swiper"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="swiper-slide__card">
                <img
                  src={
                    productImages[product.id]?.img_path
                      ? `http://localhost:8080/${
                          productImages[product.id].img_path
                        }`
                      : "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
                  }
                  alt={product.prod_name || "Product"}
                  className="swiper-slide__image"
                />
                <div className="swiper-slide__content">
                  <div>
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
                    <Link to={`/`} className="product-slide__back-arrow">
                      <img
                        src="/assets/images/icons/back-arrow.svg"
                        alt="Back to Categories"
                      />
                    </Link>
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
    </Page>
  );
}

export default ProductSlider;
