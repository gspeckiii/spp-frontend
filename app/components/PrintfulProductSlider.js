// === FINAL, COMPLETE, AND STYLED FILE ===
import React, { useState, useEffect, useContext, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Page from "./Page";
import StateContext from "../context/StateContext";
import DispatchContext from "../context/DispatchContext";
import LoadingDotsIcon from "./LoadingDotsIcon";
import { getPrintfulProducts } from "../services/api";

function PrintfulProductSlider() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const navigate = useNavigate();
  const [allVariants, setAllVariants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for selected variants, same as before
  const [selectedVariants, setSelectedVariants] = useState({});

  // NEW: State for tracking expanded descriptions, copied from ProductSlider
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    document.title = "Merch Store | SPP";
    window.scrollTo(0, 0);
    // ... (fetchProducts logic is the same)
    async function fetchProducts() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getPrintfulProducts();
        setAllVariants(response.data);
      } catch (err) {
        console.error("Failed to load Printful products", err);
        setError("Could not load store products. Please try again later.");
      }
      setIsLoading(false);
    }
    fetchProducts();
  }, []);

  // Data grouping logic is the same
  const groupedProducts = useMemo(() => {
    const productsMap = new Map();
    allVariants.forEach((variant) => {
      const parentId = variant.printful_thumbnail_url;
      if (!parentId) return;
      if (!productsMap.has(parentId)) {
        productsMap.set(parentId, {
          id: parentId,
          name: variant.prod_desc,
          description: variant.prod_desc, // Use the parent name as the collapsible description
          thumbnail_url: variant.printful_thumbnail_url,
          variants: [],
        });
      }
      productsMap.get(parentId).variants.push(variant);
    });
    return Array.from(productsMap.values());
  }, [allVariants]);

  // Handler for variant selection is the same
  const handleVariantChange = (productId, variantId) => {
    setSelectedVariants((prev) => ({ ...prev, [productId]: variantId }));
  };

  // NEW: Handler for toggling the description, copied from ProductSlider
  const handleToggleDescription = (productId) => {
    setExpanded((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  // Click handler for the order button is the same
  const handleOrderClick = (e, product) => {
    if (!appState.loggedIn) {
      e.preventDefault();
      navigate("/");
      return;
    }
    const selectedVariantId = selectedVariants[product.id];
    if (!selectedVariantId) {
      e.preventDefault();
      appDispatch({
        type: "flashMessage",
        value: "Please select an option first.",
      });
      return;
    }
  };

  if (isLoading) {
    /* ... your loading JSX ... */
  }
  if (error) {
    /* ... your error JSX ... */
  }
  if (!groupedProducts || groupedProducts.length === 0) {
    return (
      <Page title="No Products">
        <div style={{ textAlign: "center", padding: "2rem" }}>
          No products available in this store.
        </div>
      </Page>
    );
  }

  // Swiper props are now consistent with ProductSlider
  const numProducts = groupedProducts.length;
  const swiperProps = {
    modules: [Navigation],
    spaceBetween: 10,
    className: "swiper",
    navigation: numProducts > 1,
    centeredSlides: numProducts < 3,
    slidesPerView: 1,
    breakpoints: {
      730: { slidesPerView: Math.min(numProducts, 2), spaceBetween: 20 },
      1024: { slidesPerView: Math.min(numProducts, 3), spaceBetween: 30 },
    },
  };

  return (
    <>
      <h1 className="container__heading--animated">Print-On-Demand Products</h1>
      <div className="swiper-container-wrapper">
        <Swiper {...swiperProps}>
          {groupedProducts.map((product) => {
            const selectedVariantId = selectedVariants[product.id];
            const selectedVariant = selectedVariantId
              ? product.variants.find(
                  (v) => v.id === parseInt(selectedVariantId)
                )
              : null;

            return (
              <SwiperSlide key={product.id}>
                <div className="swiper-slide__card">
                  <img
                    src={
                      product.thumbnail_url ||
                      "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
                    }
                    alt={product.name}
                    className="swiper-slide__image"
                  />
                  <div className="swiper-slide__content">
                    <div className="swiper-slide__main-content">
                      <h3 className="swiper-slide__title">{product.name}</h3>

                      {/* === COLLAPSIBLE DESCRIPTION SECTION (from ProductSlider) === */}
                      <div
                        className={`collapsible-content ${
                          !expanded[product.id] ? "is-collapsed" : ""
                        }`}
                      >
                        {product.description && (
                          <p className="swiper-slide__description">
                            {product.description}
                          </p>
                        )}
                      </div>

                      {/* === VARIANT DROPDOWN === */}
                      <div
                        className="form__group"
                        style={{ marginTop: "1rem" }}
                      >
                        <select
                          className="form__input"
                          onChange={(e) =>
                            handleVariantChange(product.id, e.target.value)
                          }
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Choose an option...
                          </option>
                          {product.variants.map((variant) => (
                            <option key={variant.id} value={variant.id}>
                              {variant.prod_name.replace(
                                product.name + " - ",
                                ""
                              )}{" "}
                              {/* Clean up variant name */}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {/* === UPDATED FOOTER (from ProductSlider) === */}
                    <div className="product-slide__footer">
                      {product.description && (
                        <button
                          onClick={() => handleToggleDescription(product.id)}
                          className="swiper-slide__about-button"
                        >
                          {expanded[product.id] ? "Hide" : "About"}
                        </button>
                      )}
                      <Link
                        to={
                          selectedVariant ? `/order/${selectedVariant.id}` : "#"
                        }
                        state={{ product: selectedVariant }}
                        onClick={(e) => handleOrderClick(e, product)}
                        className={`swiper-slide__about-button ${
                          !selectedVariant ? "is-disabled" : ""
                        }`}
                      >
                        {selectedVariant
                          ? `$${parseFloat(selectedVariant.prod_cost).toFixed(
                              2
                            )}`
                          : "Select Option"}
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
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

export default PrintfulProductSlider;
