import React, { useState, useEffect } from "react"
import axios from "axios"
import { Link } from "react-router-dom"

function AdminCategoryPutSelect() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const token = localStorage.getItem("SPPtoken")
        if (!token) {
          setError("Please log in as admin to view categories")
          setLoading(false)
          return
        }
        const response = await axios.get("/api/categories", {
          headers: { Authorization: `Bearer ${token}` }
        })
        response.data.forEach(cat => {
          console.log("Category:", cat.cat_name, "prod_count:", cat.prod_count) // Debug
        })
        setCategories(response.data)
        setLoading(false)
      } catch (e) {
        setError(e.response ? e.response.data.error : "Error fetching categories")
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  const handleDelete = async id => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const token = localStorage.getItem("SPPtoken")
        await axios.delete(`/api/categories/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setCategories(categories.filter(cat => cat.id !== id))
      } catch (e) {
        setError(e.response ? e.response.data.error : "Error deleting category")
      }
    }
  }

  if (loading) return <p style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }}>Loading...</p>
  if (error)
    return (
      <p style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }} className="text-danger">
        {error}
      </p>
    )

  return (
    <div className="container mt-5">
      <h2 style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 700 }}>Select Category to Edit</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }}>Category Name</th>
            <th style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }}>Product Count</th>
            <th style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(category => (
            <tr key={category.id}>
              <td>{category.cat_name}</td>
              <td>{category.prod_count || 0}</td>
              <td>
                <Link to={`/admin-category-put/${category.id}`} className="btn btn-primary btn-sm mr-2">
                  Edit
                </Link>
                {Number(category.prod_count) === 0 && (
                  <button onClick={() => handleDelete(category.id)} className="btn btn-danger btn-sm">
                    Delete
                  </button>
                )}
                <Link to={`/admin-product-put-select/${category.id}`} className="btn btn-primary btn-sm mr-2">
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
