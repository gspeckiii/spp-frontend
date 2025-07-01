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
    return <p className="text-danger">Please log in as admin to add categories</p>
  }

  return (
    <div className="page-section--background">
      <div className="form">
        <h1 className="form__heading">Add New Category</h1> {/* BEM Element */}
        <form onSubmit={handleSubmit} className="needs-validation" noValidate>
          <div className="form__group">
            <label htmlFor="cat-name" className="form__label">
              Category Name
            </label>
            <input value={catName} onChange={e => setCatName(e.target.value)} id="cat-name" className="form__input" type="text" placeholder="Enter category name" required /> {/* BEM Element */}
          </div>
          <div className="form__group">
            <label htmlFor="cat-desc" className="form__label">
              Description
            </label>
            <input value={catDesc} onChange={e => setCatDesc(e.target.value)} id="cat-desc" className="form__input" type="text" placeholder="Enter description" required />
          </div>
          <div className="form__group">
            <label htmlFor="cat-vid" className="form__label">
              Video Link
            </label>
            <input value={catVid} onChange={e => setCatVid(e.target.value)} id="cat-vid" className="form__input" type="url" placeholder="Enter video URL (optional)" />
          </div>
          <button type="submit" className="form__button">
            Add Category
          </button>
        </form>
        <Link to="/admin-category-put-select" className="form__button">
          Back to Categories
        </Link>
      </div>
    </div>
  )
}

export default AdminCategoryPost
