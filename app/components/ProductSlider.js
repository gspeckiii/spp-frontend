import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Page from "./Page";

function ProductSlider() {
  const { id } = useParams(); // Get cat_id from URL
  const [products, setProducts] = useState([]);
  const [productImages, setProductImages] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoize products to prevent reference changes
  const memoizedProducts = useMemo(() => products, [products]);

  // Fetch products for the category
  useEffect(() => {
    console.log("ProductSlider mounted for category ID:", id);
    const fetchProducts = async () => {
      try {
        console.log(`Fetching products for category ID: ${id}`);
        const response = await fetch(
          `http://localhost:8080/api/products/category/${id}`
        );
        if (response.ok) {
          const fetchedProducts = await response.json();
          console.log(`Products for category ${id}:`, fetchedProducts);
          setProducts(Array.isArray(fetchedProducts) ? fetchedProducts : []);
          setError(null);
        } else {
          console.error(
            `Failed to fetch products for category ${id}:`,
            response.status,
            response.statusText
          );
          setError(`Failed to load products: ${response.statusText}`);
          setProducts([]);
        }
      } catch (error) {
        console.error(
          `Error fetching products for category ${id}:`,
          error.message
        );
        setError("Failed to load products");
        setProducts([]);
      }
      setIsLoading(false);
    };

    fetchProducts();
    return () => console.log("ProductSlider unmounted");
  }, [id]); // Run when id changes

  // Fetch one image per product
  useEffect(() => {
    const fetchProductImages = async () => {
      if (
        !memoizedProducts ||
        !Array.isArray(memoizedProducts) ||
        memoizedProducts.length === 0
      ) {
        console.log("No products to fetch images for");
        setIsLoading(false);
        return;
      }

      console.log("Fetching images for products:", memoizedProducts);
      const images = {};
      for (const product of memoizedProducts) {
        if (product.id) {
          if (productImages[product.id]) {
            images[product.id] = productImages[product.id];
            continue;
          }
          try {
            const response = await fetch(
              `http://localhost:8080/api/products/${product.id}/images`
            );
            if (response.ok) {
              const fetchedImages = await response.json();
              console.log(`Images for product ${product.id}:`, fetchedImages);
              images[product.id] =
                Array.isArray(fetchedImages) && fetchedImages.length > 0
                  ? {
                      img_path: fetchedImages[0].img_path,
                      img_desc: fetchedImages[0].img_desc || "",
                    }
                  : { img_path: null, img_desc: "" };
            } else {
              console.error(
                `Failed to fetch images for product ${product.id}:`,
                response.status,
                response.statusText
              );
              images[product.id] = { img_path: null, img_desc: "" };
            }
          } catch (error) {
            console.error(
              `Error fetching images for product ${product.id}:`,
              error.message
            );
            images[product.id] = { img_path: null, img_desc: "" };
          }
        }
      }
      setProductImages((prev) => ({ ...prev, ...images }));
      console.log("Updated product images:", images);
      setIsLoading(false);
    };

    fetchProductImages();
  }, [memoizedProducts]);

  const handleImageError = (e, productId) => {
    console.log(
      `Image load failed for product ${productId}: http://localhost:8080/${productImages[productId]?.img_path}`
    );
    e.target.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
    setProductImages((prev) => ({
      ...prev,
      [productId]: {
        img_path: null,
        img_desc: prev[productId]?.img_desc || "",
      },
    }));
  };

  if (error) {
    return <div className="swiper-container-wrapper">Error: {error}</div>;
  }

  if (isLoading) {
    return <div className="swiper-container-wrapper">Loading products...</div>;
  }

  if (!products || products.length === 0) {
    console.log(`No products available for category ${id}`);
    return (
      <div className="swiper-container-wrapper">
        No products available for this category
      </div>
    );
  }

  return (
    <Page title="Products">
      {/* Replaced product-slider with swiper-container-wrapper */}
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
              {/* Using the new generic BEM class names */}
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
                  onError={(e) => handleImageError(e, product.id)}
                />
                <div className="swiper-slide__content">
                  <h3 className="swiper-slide__title">
                    {product.prod_name || "Unknown"}
                  </h3>
                  {product.prod_desc && (
                    <p className="swiper-slide__description">
                      {product.prod_desc}
                    </p>
                  )}
                  {product.prod_cost && (
                    <p className="swiper-slide__cost">
                      ${parseFloat(product.prod_cost).toFixed(2)}
                    </p>
                  )}
                  {productImages[product.id]?.img_desc && (
                    <p className="swiper-slide__image-desc">
                      {productImages[product.id].img_desc}
                    </p>
                  )}
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
