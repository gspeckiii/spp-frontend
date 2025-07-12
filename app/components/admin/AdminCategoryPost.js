// app/components/admin/AdminCategoryPost.js (Refactored)

import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import StateContext from "../../context/StateContext";
import DispatchContext from "../../context/DispatchContext";
import Page from "../Page"; // Assuming you want to wrap this in your Page component
// Import the new API function
import { createCategory } from "../../services/api";

function AdminCategoryPost() {
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [catVid, setCatVid] = useState("");
  const navigate = useNavigate();
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Use the new, clean API function
      const response = await createCategory({
        cat_name: catName,
        cat_desc: catDesc,
        cat_vid: catVid || null, // Send null if the string is empty
      });

      console.log("Create category response:", response.data);
      appDispatch({
        type: "addCategory",
        data: response.data, // The API response should match the expected data structure
      });
      appDispatch({
        type: "flashMessage",
        value: "Category added successfully!",
      });

      navigate("/admin-dashboard"); // Navigate to a more appropriate place after creation
    } catch (e) {
      appDispatch({
        type: "flashMessage",
        value: e.response ? e.response.data.error : "Error adding category",
      });
      console.error("Error adding category:", e.response?.data || e.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Redirect if user is not an admin
  if (!appState.user.admin) {
    return (
      <Page title="Unauthorized">
        <p className="text-center text-danger">
          You do not have permission to perform this action.
        </p>
      </Page>
    );
  }

  return (
    <Page title="Add New Category">
      <form onSubmit={handleSubmit} className="form">
        <h2 className="form__heading">Add New Category</h2>
        <div className="form__group">
          <label htmlFor="cat-name" className="form__label">
            Category Name
          </label>
          <input
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
            id="cat-name"
            className="form__input"
            type="text"
            placeholder="Enter category name"
            required
          />
        </div>
        <div className="form__group">
          <label htmlFor="cat-desc" className="form__label">
            Description
          </label>
          <input
            value={catDesc}
            onChange={(e) => setCatDesc(e.target.value)}
            id="cat-desc"
            className="form__input"
            type="text"
            placeholder="Enter description"
            required
          />
        </div>
        <div className="form__group">
          <label htmlFor="cat-vid" className="form__label">
            Video Link
          </label>
          <input
            value={catVid}
            onChange={(e) => setCatVid(e.target.value)}
            id="cat-vid"
            className="form__input"
            type="url"
            placeholder="Enter video URL (optional)"
          />
        </div>
        <button type="submit" className="form__button" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Category"}
        </button>
        <Link
          to="/admin-dashboard"
          className="form__button"
          style={{
            marginTop: "0.5rem",
            backgroundColor: "#6c757d",
            borderColor: "#6c757d",
          }}
        >
          Back to Dashboard
        </Link>
      </form>
    </Page>
  );
}

export default AdminCategoryPost;
