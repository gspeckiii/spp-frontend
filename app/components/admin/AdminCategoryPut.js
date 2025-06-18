import React, { useState, useEffect } from "react"
import axios from "axios"
import { useParams, useNavigate, Link } from "react-router-dom"

function AdminCategoryPut() {
  const { id } = useParams() // Get category ID from URL
  const navigate = useNavigate()
  const [category, setCategory] = useState({ cat_name: "", cat_desc: "", cat_vid: "" })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState("")

  useEffect(() => {
    async function fetchCategory() {
      try {
        const token = localStorage.getItem("SPPtoken")
        if (!token) {
          setError("Please log in as admin to edit categories")
          setLoading(false)
          return
        }
        const response = await axios.get(`/api/categories/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setCategory(response.data)
        setLoading(false)
      } catch (e) {
        setError(e.response ? e.response.data.error : "Error fetching category")
        setLoading(false)
      }
    }
    fetchCategory()
  }, [id])

  const handleChange = e => {
    const { name, value } = e.target
    setCategory(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("SPPtoken")
      const response = await axios.put(`/api/categories/${id}`, category, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMessage("Category updated successfully")
      setTimeout(() => navigate(`/admin-category-put-select`), 1000) // Return to category selection after update
    } catch (e) {
      setError(e.response ? e.response.data.error : "Error updating category")
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
      {/* New Section for Product Management */}
      <div className="mb-4">
        <h3 style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 700 }}>Manage Products</h3>
        <Link to={`/admin-product-put-select/${id}`} className="btn btn-secondary btn-lg">
          View/Manage Products
        </Link>
      </div>

      {/* Category Edit Section */}
      <h2 style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 700 }}>Edit Category</h2>
      {message && (
        <p style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }} className="text-success">
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit} className="needs-validation" noValidate>
        <div className="form-group">
          <label htmlFor="cat_name" style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }}>
            Category Name
          </label>
          <input type="text" name="cat_name" value={category.cat_name} onChange={handleChange} className="form-control form-control-lg" required />
          <div className="invalid-feedback">Please provide a category name.</div>
        </div>
        <div className="form-group">
          <label htmlFor="cat_desc" style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }}>
            Description
          </label>
          <input type="text" name="cat_desc" value={category.cat_desc} onChange={handleChange} className="form-control form-control-lg" required />
          <div className="invalid-feedback">Please provide a description.</div>
        </div>
        <div className="form-group">
          <label htmlFor="cat_vid" style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }}>
            Video Link
          </label>
          <input type="url" name="cat_vid" value={category.cat_vid || ""} onChange={handleChange} className="form-control form-control-lg" />
        </div>
        <button type="submit" className="btn btn-primary btn-lg btn-block mt-4">
          Update Category
        </button>
      </form>
    </div>
  )
}

export default AdminCategoryPut
