import React, { useContext, useState } from "react"
import Axios from "axios"
import { Link } from "react-router-dom"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"

function AdminCategoryPutSelect() {
  const { categories, user } = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const [deletingId, setDeletingId] = useState(null)

  const handleDelete = async id => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        setDeletingId(id)
        const token = user.token
        await Axios.delete(`/api/categories/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        appDispatch({ type: "deleteCategory", data: id })
        appDispatch({ type: "flashMessage", value: "Category deleted successfully!" })
      } catch (e) {
        console.error("Delete category error:", e.response?.data || e.message)
        appDispatch({ type: "flashMessage", value: e.response?.data?.error || "Error deleting category" })
      } finally {
        setDeletingId(null)
      }
    }
  }

  const handleSelectCategory = category => {
    console.log("Selecting category:", category)
    appDispatch({ type: "selectCategory", data: category })
  }

  if (!user.token) {
    return <p className="text-danger">Please log in as admin to view categories</p>
  }

  if (categories.loading) {
    return <p>Loading categories...</p>
  }

  if (categories.error) {
    return <p className="text-danger">{categories.error}</p>
  }

  if (!categories.list || !Array.isArray(categories.list) || categories.list.length === 0) {
    return (
      <div className="table-select">
        <div className="table-select__section-heading">
          <h1>Categories</h1>
          <Link to="/admin-category-post" className="table-select__button table-select__button--success table-select__button--large">
            Add Category
          </Link>
        </div>
        <p>No categories available</p>
        <Link to="/admin-dashboard" className="form__button">
          Back to Dashboard
        </Link>
      </div>
    )
  }

  const uniqueCategories = Array.from(new Map(categories.list.map(cat => [cat.cat_id, cat])).values())

  return (
    <div className="page-section--background">
      <div className="table-select">
        <div className="table-select__section-heading">
          <h1>Categories</h1>
          <Link to="/admin-category-post" className="table-select__button table-select__button--success table-select__button--large">
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
            {uniqueCategories.map(category => (
              <tr key={category.cat_id}>
                <td>{category.cat_name || "Unknown"}</td>
                <td>{category.prod_count || 0}</td>
                <td>
                  {category.cat_img_path && (
                    <img
                      src={`http://localhost:8080/${category.cat_img_path}`}
                      alt={`Thumbnail for ${category.cat_name || "category"}`}
                      style={{ maxWidth: "100px", maxHeight: "100px", objectFit: "contain" }}
                      onError={e => {
                        e.target.style.display = "none"
                        console.log("Thumbnail load failed:", category.cat_img_path)
                      }}
                    />
                  )}
                </td>
                <td>
                  <Link to={`/admin-category-put/${category.cat_id}`} className="table-select__button" onClick={() => handleSelectCategory(category)}>
                    Edit
                  </Link>
                  {(category.prod_count || 0) === 0 && (
                    <button onClick={() => handleDelete(category.cat_id)} className="table-select__button" disabled={deletingId === category.cat_id}>
                      {deletingId === category.cat_id ? "Deleting..." : "Delete"}
                    </button>
                  )}
                  <Link to={`/admin-product-put-select/${category.cat_id}`} className="table-select__button" onClick={() => handleSelectCategory(category)}>
                    Products
                  </Link>
                  <Link to={`/admin-category-image-post/${category.cat_id}`} className="table-select__button" onClick={() => handleSelectCategory(category)}>
                    Upload Img
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Link to="/admin-dashboard" className="form__button">
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}

export default AdminCategoryPutSelect
