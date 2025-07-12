// app/components/admin/AdminProductImagePost.js (Refactored)

import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import StateContext from "../../context/StateContext";
import DispatchContext from "../../context/DispatchContext";
import Page from "../Page";
import LoadingDotsIcon from "../LoadingDotsIcon";
import { CSSTransition } from "react-transition-group";
// Import the new API functions
import { getProductById, addProductImages } from "../../services/api";

function AdminProductImagePost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const validationErrorRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        setProduct(response.data);
      } catch (e) {
        appDispatch({
          type: "flashMessage",
          value: "Error fetching product details.",
        });
      }
      setIsLoading(false);
    };
    fetchProduct();
  }, [id, appDispatch]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) {
      setValidationError("Please select at least one image.");
      setImage([]);
      return;
    }
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    for (const file of files) {
      if (!validTypes.includes(file.type)) {
        setValidationError("All images must be a JPEG, PNG, or GIF.");
        setImages([]);
        return;
      }
      if (file.size > maxSize) {
        setValidationError("All images must be less than 5MB.");
        setImages([]);
        return;
      }
    }
    setValidationError(null);
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0 || validationError) {
      setValidationError("Please select valid image(s) to upload.");
      return;
    }
    setIsSubmitting(true);
    const formData = new FormData();
    images.forEach((image) => formData.append("image", image));

    try {
      const response = await addProductImages(id, formData);
      appDispatch({
        type: "incrementImgCount",
        data: {
          productId: parseInt(id),
          count: response.data.count || images.length,
        },
      });
      appDispatch({
        type: "flashMessage",
        value: "Images added successfully!",
      });

      const categoryId = product?.cat_fk || location.state?.categoryId;
      navigate(
        categoryId
          ? `/admin-product-put-select/${categoryId}`
          : "/admin-dashboard"
      );
    } catch (e) {
      appDispatch({
        type: "flashMessage",
        value: e.response?.data?.error || "Error adding images",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    const categoryId = product?.cat_fk || location.state?.categoryId;
    navigate(
      categoryId
        ? `/admin-product-put-select/${categoryId}`
        : "/admin-dashboard"
    );
  };

  // Security check
  if (!user.admin) {
    return (
      <Page title="Unauthorized">
        <p className="text-center text-danger">You do not have permission.</p>
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

  return (
    <Page title={`Add Images to ${product?.prod_name || "Product"}`}>
      <form onSubmit={handleSubmit} className="form">
        <h2 className="form__heading">
          Add Images to {product?.prod_name || "..."}
        </h2>
        <div className="form__group">
          <label htmlFor="images" className="form__label">
            Product Images
          </label>
          <input
            type="file"
            name="images"
            onChange={handleFileChange}
            className="form__input"
            id="images"
            multiple
            accept="image/jpeg,image/png,image/gif"
          />
          <small className="form__helper-text">
            Select one or more images (JPEG, PNG, GIF, max 5MB each)
          </small>
          <CSSTransition
            nodeRef={validationErrorRef}
            in={!!validationError}
            timeout={330}
            classNames="liveValidateMessage"
            unmountOnExit
          >
            <div ref={validationErrorRef} className="form__validation-message">
              {validationError}
            </div>
          </CSSTransition>
        </div>
        <div className="form__group">
          <button
            type="submit"
            className="form__button"
            disabled={!!validationError || images.length === 0 || isSubmitting}
          >
            {isSubmitting ? "Uploading..." : "Add Images"}
          </button>
          <button
            type="button"
            className="form__button form__button--secondary"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </Page>
  );
}

export default AdminProductImagePost;
