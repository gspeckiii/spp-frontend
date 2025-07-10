import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import StateContext from "../../context/StateContext";
import DispatchContext from "../../context/DispatchContext";

function AdminCategoryPut() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { categories } = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const [category, setCategory] = useState({
    cat_name: "",
    cat_desc: "",
    cat_vid: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id || isNaN(parseInt(id))) {
      setError("Invalid category ID");
      setLoading(false);
      return;
    }

    async function fetchCategory() {
      try {
        const token = localStorage.getItem("SPPtoken");
        if (!token) {
          setError("Please log in as admin to edit categories");
          setLoading(false);
          return;
        }
        const response = await Axios.get(`/categories/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched category:", response.data);
        setCategory(response.data);
        setLoading(false);
      } catch (e) {
        setError(
          e.response ? e.response.data.error : "Error fetching category"
        );
        setLoading(false);
      }
    }
    fetchCategory();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("SPPtoken");
      const response = await Axios.put(`/categories/${id}`, category, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Update response:", response.data);
      // Find existing category to preserve prod_count
      const existingCategory = categories.list.find(
        (cat) => cat.cat_id === parseInt(id)
      );
      const updatedCategory = {
        cat_id: parseInt(id),
        prod_count: existingCategory ? existingCategory.prod_count : 0,
        ...response.data,
      };
      appDispatch({
        type: "updateCategory",
        data: updatedCategory,
      });
      appDispatch({
        type: "flashMessage",
        value: "Category updated successfully!",
      });
      navigate("/admin-category-put-select");
    } catch (e) {
      appDispatch({
        type: "flashMessage",
        value: e.response ? e.response.data.error : "Error updating category",
      });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="wrapper">
      <div className="form">
        <div className="form__heading">
          <h1>Manage Products</h1>
          <Link to={`/admin-product-put-select/${id}`} className="btn">
            View/Manage Products
          </Link>
        </div>

        <h2>Edit Category</h2>
        <form onSubmit={handleSubmit} className="needs-validation" noValidate>
          <div className="form-group">
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
          <div className="form-group">
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
          <div className="form-group">
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
          <button type="submit" className="form__button">
            Update Category
          </button>
        </form>

        <Link to="/admin-category-put-select" className="form__button">
          Back to Categories
        </Link>
      </div>
    </div>
  );
}

export default AdminCategoryPut;
