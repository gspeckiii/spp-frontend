import React, { useState, useContext } from "react"
import Axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"

function AdminCategoryPost() {
  const [catName, setCatName] = useState("")
  const [catDesc, setCatDesc] = useState("")
  const [catVid, setCatVid] = useState("")
  const navigate = useNavigate()
  const { user } = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const token = localStorage.getItem("SPPtoken")
      if (!token) {
        appDispatch({ type: "flashMessage", value: "Please log in as admin to add categories" })
        return
      }
      const response = await Axios.post(
        "/categories",
        { cat_name: catName, cat_desc: catDesc, cat_vid: catVid || null },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      console.log("Create category response:", response.data)
      appDispatch({
        type: "addCategory",
        data: {
          id: response.data.cat_id,
          cat_id: response.data.cat_id,
          cat_name: response.data.cat_name,
          cat_desc: response.data.cat_desc,
          cat_vid: response.data.cat_vid,
          prod_count: response.data.prod_count || 0
        }
      })
      appDispatch({ type: "flashMessage", value: "Category added successfully!" })
      setCatName("")
      setCatDesc("")
      setCatVid("")
      navigate("/admin-category-put-select")
    } catch (e) {
      appDispatch({ type: "flashMessage", value: e.response ? e.response.data.error : "Error adding category" })
      console.error("Error adding category:", e)
    }
  }

  if (!user.token) {
    return (
      <p style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: "400" }} className="text-danger">
        Please log in as admin to add categories
      </p>
    )
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
      </form>
      <div className="mb-3 back-button">
        <Link to="/admin-category-put-select" className="btn btn-secondary">
          Back to Categories
        </Link>
      </div>
    </div>
  )
}

export default AdminCategoryPost
