// app/components/admin/AdminProductPut.js

import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import StateContext from "../../context/StateContext";
import DispatchContext from "../../context/DispatchContext";
import Page from "../Page";
import LoadingDotsIcon from "../LoadingDotsIcon";
import {
  getProductById,
  updateProduct,
  getCategoryById,
} from "../../services/api";

function AdminProductPut() {
  const { id } = useParams(); // This is the product ID
  const navigate = useNavigate();
  const { user } = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  const [product, setProduct] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await getProductById(id);
        const fetchedProduct = productResponse.data;
        setProduct(fetchedProduct);

        if (fetchedProduct.cat_fk) {
          const categoryResponse = await getCategoryById(fetchedProduct.cat_fk);
          setCategoryName(categoryResponse.data.cat_name || "Unknown Category");
        }
      } catch (e) {
        console.error("Error fetching data:", e);
        setError("Could not load product data.");
      }
      setIsLoading(false);
    };
    fetchData();
  }, [id]);

  // --- MODIFIED: This handler now correctly processes checkbox changes ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Use 'checked' for checkbox input type, otherwise use 'value'
    const newValue = type === "checkbox" ? checked : value;
    setProduct((prev) => ({ ...prev, [name]: newValue }));
  };

  // --- MODIFIED: This now sends the 'historic' field in the update payload ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateProduct(id, {
        prod_name: product.prod_name,
        prod_desc: product.prod_desc,
        prod_cost: product.prod_cost,
        cat_fk: product.cat_fk,
        historic: product.historic, // Send the historic status
      });

      appDispatch({
        type: "flashMessage",
        value: "Product updated successfully!",
      });
      navigate(`/admin-product-put-select/${product.cat_fk}`);
    } catch (e) {
      appDispatch({
        type: "flashMessage",
        value: e.response?.data?.error || "Error updating product",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/admin-product-put-select/${product.cat_fk}`);
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
  if (error || !product) {
    return (
      <Page title="Error">
        <p className="text-center text-danger">
          {error || "Product not found."}
        </p>
      </Page>
    );
  }

  return (
    <Page title={`Edit Product: ${product.prod_name}`}>
      <form onSubmit={handleSubmit} className="form">
        <h2 className="form__heading">Edit Product in {categoryName}</h2>

        <div className="form__group">
          <label className="form__label" htmlFor="prod_name">
            Product Name
          </label>
          <input
            type="text"
            id="prod_name"
            name="prod_name"
            value={product.prod_name}
            onChange={handleChange}
            className="form__input"
            required
          />
        </div>

        <div className="form__group">
          <label className="form__label" htmlFor="prod_desc">
            Description
          </label>
          <input
            type="text"
            id="prod_desc"
            name="prod_desc"
            value={product.prod_desc || ""}
            onChange={handleChange}
            className="form__input"
            required
          />
        </div>

        <div className="form__group">
          <label className="form__label" htmlFor="prod_cost">
            Cost
          </label>
          <input
            type="number"
            id="prod_cost"
            name="prod_cost"
            value={product.prod_cost}
            onChange={handleChange}
            className="form__input"
            step="0.01"
            required
          />
        </div>

        {/* --- NEW: Checkbox for marking product as historic --- */}
        <div className="form__group form__group--checkbox">
          <input
            type="checkbox"
            name="historic"
            id="historic"
            // Use '!!' to ensure the value is always a boolean for the 'checked' prop
            checked={!!product.historic}
            onChange={handleChange}
            className="form__input--checkbox"
          />
          <label className="form__label--checkbox" htmlFor="historic">
            Mark as Historic (will be hidden from public category view)
          </label>
        </div>

        <button type="submit" className="form__button" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Update Product"}
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

export default AdminProductPut;
