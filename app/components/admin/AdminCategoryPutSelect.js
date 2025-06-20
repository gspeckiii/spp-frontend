import React, { useContext } from "react"
import Axios from "axios"
import { Link } from "react-router-dom"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"

function AdminCategoryPutSelect() {
  const { categories, user } = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const handleDelete = async id => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const token = user.token
        await Axios.delete(`/categories/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        appDispatch({ type: "deleteCategory", data: id })
        appDispatch({ type: "flashMessage", value: "Category deleted successfully!" })
      } catch (e) {
        appDispatch({ type: "flashMessage", value: e.response ? e.response.data.error : "Error deleting category" })
      }
    }
  }

  const handleSelectCategory = category => {
    console.log("Selecting category:", category)
    appDispatch({ type: "selectCategory", data: category })
  }

  console.log("Categories list:", categories.list)

  if (!user.token) {
    return (
      <p style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: "400" }} className="text-danger">
        Please log in as admin to view categories
      </p>
    )
  }

  if (categories.loading) {
    return <p style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: "400" }}>Loading...</p>
  }

  if (categories.error) {
    return (
      <p style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: "400" }} className="text-danger">
        {categories.error}
      </p>
    )
  }

  return (
    <div className="container mt-5">
      <h2 style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: "700" }}>Select Category to Edit</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: "400" }}>Category Name</th>
            <th style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: "400" }}>Product Count</th>
            <th style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: "400" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.list.map(category => (
            <tr key={category.id}>
              <td>{category.cat_name}</td>
              <td>{category.prod_count || 0}</td>
              <td>
                <Link to={`/admin-category-put/${category.id}`} className="btn btn-primary btn-sm mr-2" onClick={() => handleSelectCategory(category)}>
                  Edit
                </Link>
                {Number(category.prod_count) === 0 && (
                  <button onClick={() => handleDelete(category.id)} className="btn btn-success btn-sm mr-2">
                    Delete
                  </button>
                )}
                <Link to={`/admin-product-put-select/${category.id}`} className="btn btn-primary btn-sm mr-2" onClick={() => handleSelectCategory(category)}>
                  Products
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mb-3 back-button">
        <Link to="/admin-dashboard" className="btn btn-secondary">
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}

export default AdminCategoryPutSelect
