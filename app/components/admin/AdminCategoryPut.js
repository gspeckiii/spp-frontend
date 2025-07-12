// app/components/admin/AdminCategoryPut.js (Refactored)

import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import StateContext from "../../context/StateContext";
import DispatchContext from "../../context/DispatchContext";
import Page from "../Page";
import LoadingDotsIcon from "../LoadingDotsIcon";
// Import the new API functions
import { getCategoryById, updateCategory } from "../../services/api";

function AdminCategoryPut() {
  const { id } = useParams();
  const navigate = useNavigate();
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  const [category, setCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // This effect now only fetches the initial data for the form.
    const fetchCategory = async () => {
      try {
        const response = await getCategoryById(id);
        console.log("Fetched category:", response.data);
        setCategory(response.data);
      } catch (e) {
        console.error("Error fetching category details:", e);
        setError("Could not load category information.");
      }
      setIsLoading(false);
    };
    fetchCategory();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await updateCategory(id, {
        cat_name: category.cat_name,
        cat_desc: category.cat_desc,
        cat_vid: category.cat_vid || null,
      });

      console.log("Update response:", response.data);

      appDispatch({
        type: "updateCategory",
        data: response.data, // The API should return the complete, updated category object
      });
      appDispatch({
        type: "flashMessage",
        value: "Category updated successfully!",
      });
      navigate("/admin-dashboard");
    } catch (e) {
      appDispatch({
        type: "flashMessage",
        value: e.response?.data?.error || "Error updating category",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Security check
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
  if (error) {
    return (
      <Page title="Error">
        <p className="text-center text-danger">{error}</p>
      </Page>
    );
  }

  return (
    <Page title={`Edit Category: ${category?.cat_name}`}>
      <form onSubmit={handleSubmit} className="form">
        <div
          className="form__heading"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2>Edit Category</h2>
          <Link
            to={`/admin-product-put-select/${id}`}
            className="form__button"
            style={{ marginTop: 0, padding: "0.5rem 1rem" }}
          >
            Manage Products
          </Link>
        </div>

        <div className="form__group">
          <label htmlFor="cat_name" className="form__label">
            Category Name
          </label>
          <input
            type="text"
            name="cat_name"
            value={category.cat_name}
            onChange={handleChange}
            className="form__input"
            required
          />
        </div>

        <div className="form__group">
          <label htmlFor="cat_desc" className="form__label">
            Description
          </label>
          <input
            type="text"
            name="cat_desc"
            value={category.cat_desc}
            onChange={handleChange}
            className="form__input"
            required
          />
        </div>

        <div className="form__group">
          <label htmlFor="cat_vid" className="form__label">
            Video Link
          </label>
          <input
            type="url"
            name="cat_vid"
            value={category.cat_vid || ""}
            onChange={handleChange}
            className="form__input"
          />
        </div>

        <button type="submit" className="form__button" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Update Category"}
        </button>
        <Link
          to="/admin-dashboard"
          className="form__button form__button--secondary"
        >
          Back to Dashboard
        </Link>
      </form>
    </Page>
  );
}

export default AdminCategoryPut;
