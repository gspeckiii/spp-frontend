// app/components/admin/AdminProductImagePut.js (Refactored)

import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import StateContext from "../../context/StateContext";
import DispatchContext from "../../context/DispatchContext";
import Page from "../Page";
import LoadingDotsIcon from "../LoadingDotsIcon";
// Import the new API functions
import { getImageById, updateImage } from "../../services/api";

function AdminProductImagePut() {
  const { id } = useParams(); // This is the image ID
  const navigate = useNavigate();
  const location = useLocation();
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await getImageById(id);
        setImage(response.data);
      } catch (e) {
        setError("Could not load image details.");
      }
      setIsLoading(false);
    };
    fetchImage();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setImage((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const updatedData = {
      img_desc: image.img_desc,
      img_order: parseInt(image.img_order) || 0,
      img_media: parseInt(image.img_media) || 0,
    };

    try {
      await updateImage(id, updatedData);

      appDispatch({
        type: "flashMessage",
        value: "Image metadata updated successfully!",
      });

      const productId = location.state?.productId;
      navigate(
        productId
          ? `/admin-product-image-put-select/${productId}`
          : "/admin-dashboard"
      );
    } catch (e) {
      appDispatch({
        type: "flashMessage",
        value: e.response?.data?.error || "Error updating image",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    const productId = location.state?.productId;
    navigate(
      productId
        ? `/admin-product-image-put-select/${productId}`
        : "/admin-dashboard"
    );
  };

  if (!appState.user.admin) {
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
  if (error || !image) {
    return (
      <Page title="Error">
        <p className="text-center text-danger">{error || "Image not found."}</p>
      </Page>
    );
  }

  return (
    <Page title="Edit Image Metadata">
      <form onSubmit={handleSubmit} className="form">
        <h2 className="form__heading">Editing Image</h2>

        {image.img_path && (
          <div className="form__group text-center">
            <img
              src={`${appState.urls.images}${image.img_path}`}
              alt={image.img_desc || "Image preview"}
              style={{
                maxWidth: "300px",
                maxHeight: "300px",
                objectFit: "contain",
                margin: "0 auto",
                borderRadius: "4px",
              }}
            />
            <small className="form__helper-text">{image.img_path}</small>
          </div>
        )}

        <div className="form__group">
          <label className="form__label" htmlFor="img_desc">
            Image Description
          </label>
          <input
            type="text"
            name="img_desc"
            value={image.img_desc}
            onChange={handleChange}
            className="form__input"
            required
          />
        </div>

        <div className="form__group">
          <label className="form__label" htmlFor="img_order">
            Display Order
          </label>
          <input
            type="number"
            name="img_order"
            value={image.img_order}
            onChange={handleChange}
            className="form__input"
            min="0"
            required
          />
        </div>

        <div className="form__group">
          <label className="form__label" htmlFor="img_media">
            Media Type
          </label>
          <input
            type="number"
            name="img_media"
            value={image.img_media}
            onChange={handleChange}
            className="form__input"
            min="0"
            required
          />
        </div>

        <button type="submit" className="form__button" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Update Metadata"}
        </button>
        <button
          type="button"
          className="form__button form__button--secondary"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </form>
    </Page>
  );
}

export default AdminProductImagePut;
