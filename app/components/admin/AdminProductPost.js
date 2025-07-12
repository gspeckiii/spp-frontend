// app/components/admin/AdminProductPost.js (Refactored)

import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import StateContext from "../../context/StateContext";
import DispatchContext from "../../context/DispatchContext";
import Page from "../Page";
import LoadingDotsIcon from "../LoadingDotsIcon";
// Import the new API functions
import { getCategoryById, createProduct } from "../../services/api";

function AdminProductPost() {
  const { id } = useParams(); // This is the category ID
  const navigate = useNavigate();
  const { user } = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  const [product, setProduct] = useState({
    prod_name: "",
    prod_desc: "",
    prod_cost: "",
    cat_fk: id || "",
  });
  const [categoryName, setCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await getCategoryById(id);
        setCategoryName(response.data.cat_name || "Unknown Category");
      } catch (e) {
        setError("Error fetching category details.");
      }
      setIsLoading(false);
    };
    fetchCategory();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createProduct(product);

      appDispatch({ type: "incrementProdCount", data: parseInt(id) });
      appDispatch({
        type: "flashMessage",
        value: "Product added successfully!",
      });

      navigate(`/admin-product-put-select/${id}`);
    } catch (e) {
      appDispatch({
        type: "flashMessage",
        value: e.response?.data?.error || "Error adding product",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/admin-product-put-select/${id}`);
  };

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
  if (error) {
    return (
      <Page title="Error">
        <p className="text-center text-danger">{error}</p>
      </Page>
    );
  }

  return (
    <Page title={`Add Product to ${categoryName}`}>
      <form onSubmit={handleSubmit} className="form">
        <h2 className="form__heading">Add Product to {categoryName}</h2>
        <div className="form__group">
          <label htmlFor="prod_name" className="form__label">
            Product Name
          </label>
          <input
            type="text"
            name="prod_name"
            value={product.prod_name}
            onChange={handleChange}
            className="form__input"
            required
          />
        </div>
        <div className="form__group">
          <label htmlFor="prod_desc" className="form__label">
            Description
          </label>
          <input
            type="text"
            name="prod_desc"
            value={product.prod_desc}
            onChange={handleChange}
            className="form__input"
            required
          />
        </div>
        <div className="form__group">
          <label htmlFor="prod_cost" className="form__label">
            Cost
          </label>
          <input
            type="number"
            name="prod_cost"
            value={product.prod_cost}
            onChange={handleChange}
            className="form__input"
            step="0.01"
            required
          />
        </div>

        <button type="submit" className="form__button" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Product"}
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

export default AdminProductPost;
