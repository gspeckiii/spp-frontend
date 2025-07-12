// app/components/admin/AdminProductPut.js (Refactored)

import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import StateContext from "../../context/StateContext";
import DispatchContext from "../../context/DispatchContext";
import Page from "../Page";
import LoadingDotsIcon from "../LoadingDotsIcon";
// Import the new API functions
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateProduct(id, {
        prod_name: product.prod_name,
        prod_desc: product.prod_desc,
        prod_cost: product.prod_cost,
        cat_fk: product.cat_fk,
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
            name="prod_cost"
            value={product.prod_cost}
            onChange={handleChange}
            className="form__input"
            step="0.01"
            required
          />
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
