// app/components/admin/AdminCategoryPutSelect.js (Refactored)

import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import StateContext from "../../context/StateContext";
import DispatchContext from "../../context/DispatchContext";
import Page from "../Page"; // Assuming you want a consistent page layout
import LoadingDotsIcon from "../LoadingDotsIcon";
// Import the new API function
import { deleteCategory } from "../../services/api";

function AdminCategoryPutSelect() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const { categories, user, urls } = appState; // Destructure what we need
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    // Using a more standard confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to delete this category? This action cannot be undone."
    );
    if (confirmed) {
      setDeletingId(id);
      try {
        // Use the new, clean API function
        await deleteCategory(id);

        appDispatch({ type: "deleteCategory", data: id });
        appDispatch({
          type: "flashMessage",
          value: "Category deleted successfully!",
        });
      } catch (e) {
        console.error("Delete category error:", e.response?.data || e.message);
        appDispatch({
          type: "flashMessage",
          value: e.response?.data?.error || "Error deleting category",
        });
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleSelectCategory = (category) => {
    console.log("Selecting category:", category);
    appDispatch({ type: "selectCategory", data: category });
  };

  // Security check
  if (!user.admin) {
    return (
      <Page title="Unauthorized">
        <p className="text-center text-danger">
          You do not have permission to perform this action.
        </p>
      </Page>
    );
  }

  // Loading and error states from global context
  if (categories.loading) {
    return (
      <Page title="Loading...">
        <LoadingDotsIcon />
      </Page>
    );
  }
  if (categories.error) {
    return (
      <Page title="Error">
        <p className="text-danger">{categories.error}</p>
      </Page>
    );
  }

  // Handle no categories found
  if (!categories.list || categories.list.length === 0) {
    return (
      <Page title="Manage Categories">
        <div className="table-select">
          <div className="table-select__section-heading">
            <h1>Categories</h1>
            <Link
              to="/admin-category-post"
              className="table-select__button table-select__button--success"
            >
              Add Category
            </Link>
          </div>
          <p>No categories available. Please add one.</p>
          <Link
            to="/admin-dashboard"
            className="form__button form__button--secondary"
          >
            Back to Dashboard
          </Link>
        </div>
      </Page>
    );
  }

  return (
    <Page title="Manage Categories">
      <div className="page-section">
        <div className="table-select">
          <div className="table-select__section-heading">
            <h1>Categories</h1>
            <Link
              to="/admin-category-post"
              className="table-select__button table-select__button--success"
            >
              Add Category
            </Link>
          </div>

          <table className="table-select__table">
            <thead className="table-select__heading">
              <tr>
                <th>Category Name</th>
                <th>Product Count</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.list.map((category) => (
                <tr key={category.cat_id}>
                  <td>{category.cat_name || "Unknown"}</td>
                  <td>{category.prod_count || 0}</td>
                  <td>
                    {category.cat_img_path && (
                      <img
                        // === THE REFACTOR: Use the URL from context ===
                        src={`${urls.images}${category.cat_img_path}`}
                        alt={`Thumbnail for ${category.cat_name || "category"}`}
                        className="table-select__thumbnail" // Use a class instead of inline style
                      />
                    )}
                  </td>
                  <td>
                    <Link
                      to={`/admin-category-put/${category.cat_id}`}
                      className="table-select__button"
                      onClick={() => handleSelectCategory(category)}
                    >
                      Edit
                    </Link>
                    {/* The delete button is now more robust */}
                    {(category.prod_count || 0) === 0 && (
                      <button
                        onClick={() => handleDelete(category.cat_id)}
                        className="table-select__button table-select__button--danger"
                        disabled={deletingId === category.cat_id}
                      >
                        {deletingId === category.cat_id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    )}
                    <Link
                      to={`/admin-product-put-select/${category.cat_id}`}
                      className="table-select__button"
                      onClick={() => handleSelectCategory(category)}
                    >
                      Products
                    </Link>
                    <Link
                      to={`/admin-category-image-post/${category.cat_id}`}
                      className="table-select__button"
                      onClick={() => handleSelectCategory(category)}
                    >
                      Upload Img
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link
            to="/admin-dashboard"
            className="form__button form__button--secondary"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </Page>
  );
}

export default AdminCategoryPutSelect;
