// app/components/admin/AdminProductPutSelect.js (Refactored)

import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import StateContext from "../../context/StateContext";
import DispatchContext from "../../context/DispatchContext";
import Page from "../Page";
import LoadingDotsIcon from "../LoadingDotsIcon";
// Import the new API functions
import {
  getCategoryById,
  getProductsByCategory,
  deleteProduct,
} from "../../services/api";

function AdminProductPutSelect() {
  const { id } = useParams(); // This is the category ID
  const { user } = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryResponse, productsResponse] = await Promise.all([
          getCategoryById(id),
          getProductsByCategory(id),
        ]);

        setCategory(categoryResponse.data);
        setProducts(productsResponse.data);

        appDispatch({ type: "selectCategory", data: categoryResponse.data });
        appDispatch({ type: "setProducts", data: productsResponse.data });
      } catch (e) {
        console.error("Fetch error:", e);
        setError("Could not load data for this category.");
      }
      setIsLoading(false);
    };
    fetchData();
  }, [id, appDispatch]);

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setDeletingId(productId);
      try {
        await deleteProduct(productId);
        setProducts((prevProducts) =>
          prevProducts.filter((prod) => prod.id !== productId)
        );
        appDispatch({ type: "decrementProdCount", data: parseInt(id) });
        appDispatch({
          type: "flashMessage",
          value: "Product deleted successfully!",
        });
      } catch (e) {
        appDispatch({
          type: "flashMessage",
          value: e.response?.data?.error || "Error deleting product",
        });
      } finally {
        setDeletingId(null);
      }
    }
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
  if (error) {
    return (
      <Page title="Error">
        <p className="text-center text-danger">{error}</p>
      </Page>
    );
  }

  return (
    <Page title={`Manage Products in ${category?.cat_name || "Category"}`}>
      <div className="table-select">
        <div className="table-select__section-heading">
          <h1>Products in: {category ? category.cat_name : "..."}</h1>
          <Link
            to={`/admin-product-post/${id}`}
            className="table-select__button table-select__button--success"
          >
            Add Product
          </Link>
        </div>

        {products.length === 0 ? (
          <p className="text-center">
            No products have been added to this category yet.
          </p>
        ) : (
          <table className="table-select__table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Price</th>
                <th>Image Count</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.prod_name}</td>
                  <td>${product.prod_cost || "0.00"}</td>
                  <td>{product.img_count || 0}</td>
                  <td>
                    <Link
                      to={`/admin-product-put/${product.id}`}
                      className="table-select__button"
                    >
                      Edit
                    </Link>
                    {(parseInt(product.img_count) || 0) === 0 && (
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="table-select__button table-select__button--danger"
                        disabled={deletingId === product.id}
                      >
                        {deletingId === product.id ? "..." : "Delete"}
                      </button>
                    )}
                    <Link
                      to={`/admin-product-image-put-select/${product.id}`}
                      className="table-select__button"
                    >
                      Manage Images
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <Link
          to="/admin-category-put-select"
          className="form__button form__button--secondary"
        >
          Back to Categories
        </Link>
      </div>
    </Page>
  );
}

export default AdminProductPutSelect;
