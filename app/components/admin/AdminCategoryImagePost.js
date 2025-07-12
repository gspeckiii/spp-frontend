// app/components/admin/AdminCategoryImagePost.js (Refactored)

import React, { useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DispatchContext from "../../context/DispatchContext";
import { CSSTransition } from "react-transition-group";
import FlashMessages from "../FlashMessages";
// Import the new API function
import { updateCategoryImage } from "../../services/api";

function AdminCategoryImagePost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const appDispatch = useContext(DispatchContext);
  const [image, setImage] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const validationErrorRef = useRef(null); // Ref for CSSTransition

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setValidationError("Please select an image.");
      setImage(null);
      return;
    }
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      setValidationError("Image must be a JPEG, PNG, or GIF.");
      setImage(null);
    } else if (file.size > maxSize) {
      setValidationError("Image must be less than 5MB.");
      setImage(null);
    } else {
      setValidationError(null);
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setValidationError("Please select an image to upload.");
      return;
    }
    const formData = new FormData();
    formData.append("image", image);

    try {
      // Use the new, clean API function
      const response = await updateCategoryImage(id, formData);

      // Note: The reducer action here is hypothetical. Make sure you have
      // an 'updateCategoryImage' case in your GlobalStateProvider reducer.
      appDispatch({
        type: "updateCategory", // Assuming this action updates the image path
        data: {
          cat_id: parseInt(id),
          cat_img_path: response.data.cat_img_path,
        },
      });
      appDispatch({
        type: "flashMessage",
        value: "Category image updated successfully!",
      });
      navigate("/admin-dashboard"); // Navigate to a more appropriate place
    } catch (e) {
      console.error("Image upload error:", e.response?.data || e.message);
      appDispatch({
        type: "flashMessage",
        value: e.response?.data?.error || "Error updating image",
      });
    }
  };

  const handleCancel = () => {
    navigate("/admin-dashboard");
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit} className="form">
        <h2 className="form__heading">Update Category Image</h2>
        <div className="form__group">
          <label htmlFor="image" className="form__label">
            Category Image File
          </label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            className="form__input"
            id="image"
            accept="image/jpeg,image/png,image/gif"
          />
          <small className="form__helper-text">
            Select one image (JPEG, PNG, GIF, max 5MB)
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
            disabled={!!validationError || !image}
          >
            Update Image
          </button>
          <button
            type="button"
            className="form__button"
            style={{ marginTop: "0.5rem", backgroundColor: "#6c757d" }}
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminCategoryImagePost;
