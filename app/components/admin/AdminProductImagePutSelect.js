// app/components/admin/AdminProductImagePutSelect.js (Refactored)

import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import StateContext from "../../context/StateContext";
import DispatchContext from "../../context/DispatchContext";
import Page from "../Page";
import LoadingDotsIcon from "../LoadingDotsIcon";
// Import the new API functions
import {
  getProductById,
  getProductImages,
  deleteImage,
} from "../../services/api";

function AdminProductImagePutSelect() {
  const { id } = useParams(); // This is the product ID
  const navigate = useNavigate();
  const location = useLocation();
  const { user, urls } = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product and images in parallel for better performance
        const [productResponse, imagesResponse] = await Promise.all([
          getProductById(id),
          getProductImages(id),
        ]);

        setProduct(productResponse.data);
        setImages(imagesResponse.data);
      } catch (e) {
        console.error("Error fetching product data and images:", e);
        appDispatch({
          type: "flashMessage",
          value: "Could not load product data.",
        });
      }
      setLoading(false);
    };
    fetchData();
  }, [id, appDispatch]);

  const handleDelete = async (imageId) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      setDeletingId(imageId);
      try {
        await deleteImage(imageId);
        setImages((prevImages) =>
          prevImages.filter((img) => img.id !== imageId)
        );
        appDispatch({
          type: "incrementImgCount",
          data: { productId: parseInt(id), count: -1 },
        });
        appDispatch({
          type: "flashMessage",
          value: "Image deleted successfully!",
        });
      } catch (e) {
        appDispatch({
          type: "flashMessage",
          value: e.response?.data?.error || "Error deleting image",
        });
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleEdit = (imageId) => {
    navigate(`/admin-product-image-put/${imageId}`, {
      state: { productId: id },
    });
  };

  if (!user.admin) {
    return (
      <Page title="Unauthorized">
        <p className="text-center text-danger">You do not have permission.</p>
      </Page>
    );
  }
  if (loading) {
    return (
      <Page title="Loading...">
        <LoadingDotsIcon />
      </Page>
    );
  }
  if (!product) {
    return (
      <Page title="Not Found">
        <div className="text-center">
          <p className="text-danger">Product not found.</p>
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
    <Page title={`Manage Images for ${product.prod_name}`}>
      <div className="table-select">
        <div className="table-select__section-heading">
          <h1>Images for: {product.prod_name}</h1>
          <Link
            to={`/admin-product-image-post/${id}`}
            state={{ categoryId: product.cat_fk }}
            className="table-select__button table-select__button--success"
          >
            Add New Images
          </Link>
        </div>

        {images.length === 0 ? (
          <p className="text-center">
            No images have been uploaded for this product yet.
          </p>
        ) : (
          <table className="table-select__table">
            <thead>
              <tr>
                <th>Thumbnail</th>
                <th>Description</th>
                <th>Order</th>
                <th>Media Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {images.map((image) => (
                <tr key={image.id}>
                  <td>
                    {image.img_path && (
                      <img
                        src={`${urls.images}${image.img_path}`}
                        alt={image.img_desc || "Product image"}
                        className="table-select__thumbnail"
                      />
                    )}
                  </td>
                  <td>{image.img_desc || "N/A"}</td>
                  <td>{image.img_order}</td>
                  <td>{image.img_media}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(image.id)}
                      className="table-select__button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(image.id)}
                      className="table-select__button table-select__button--danger"
                      disabled={deletingId === image.id}
                    >
                      {deletingId === image.id ? "..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Link
          to={`/admin-product-put-select/${product.cat_fk}`}
          className="form__button form__button--secondary"
        >
          Back to Product List
        </Link>
      </div>
    </Page>
  );
}

export default AdminProductImagePutSelect;
