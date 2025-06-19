import React, { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function AdminCategoryPost() {
  const [catName, setCatName] = useState("")
  const [catDesc, setCatDesc] = useState("")
  const [catVid, setCatVid] = useState("")
  const [message, setMessage] = useState("")
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const token = localStorage.getItem("SPPtoken")
      if (!token) {
        setMessage("Please log in as admin to add categories")
        return
      }
      const response = await axios.post(
        "/api/categories",
        { cat_name: catName, cat_desc: catDesc, cat_vid: catVid },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      setMessage("Category added successfully")
      setCatName("")
      setCatDesc("")
      setCatVid("")
      navigate("/admin-dashboard")
    } catch (e) {
      setMessage(e.response ? e.response.data.error : "Error adding category")
      console.error("Error adding category:", e)
    }
  }

  return (
    <div className="container mt-5">
      <h2 style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 700 }}>Add New Category</h2>
      <form onSubmit={handleSubmit} className="needs-validation" noValidate>
        <div className="form-group">
          <label htmlFor="cat-name" style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }}>
            Category Name
          </label>
          <input value={catName} onChange={e => setCatName(e.target.value)} id="cat-name" className="form-control form-control-lg" type="text" placeholder="Enter category name" required />
          <div className="invalid-feedback">Please provide a category name.</div>
        </div>
        <div className="form-group">
          <label htmlFor="cat-desc" style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }}>
            Description
          </label>
          <input value={catDesc} onChange={e => setCatDesc(e.target.value)} id="cat-desc" className="form-control form-control-lg" type="text" placeholder="Enter description" required />
          <div className="invalid-feedback">Please provide a description.</div>
        </div>
        <div className="form-group">
          <label htmlFor="cat-vid" style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }}>
            Video Link
          </label>
          <input value={catVid} onChange={e => setCatVid(e.target.value)} id="cat-vid" className="form-control form-control-lg" type="url" placeholder="Enter video URL (optional)" />
        </div>
        <button type="submit" className="btn btn-primary btn-lg btn-block mt-4">
          Add Category
        </button>
        {message && (
          <p className="mt-2 text-success" style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }}>
            {message}
          </p>
        )}
      </form>
      <div className="mb-3 back-button">
        <Link to="/admin-category-put-select" className="btn btn-secondary">
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}

export default AdminCategoryPost
