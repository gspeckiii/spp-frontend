import React, { useState, useContext } from "react"
import Axios from "axios"
import { useParams, useNavigate } from "react-router-dom"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"
import { CSSTransition } from "react-transition-group"
import FlashMessages from "../FlashMessages"

function AdminCategoryImagePost() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const [image, setImage] = useState(null)
  const [validationError, setValidationError] = useState(null)

  const handleFileChange = e => {
    const file = e.target.files[0]
    if (!file) {
      setValidationError("Please select an image.")
      setImage(null)
      return
    }
    const validTypes = ["image/jpeg", "image/png", "image/gif"]
    const maxSize = 1 * 1024 * 1024 // 1MB
    if (!validTypes.includes(file.type)) {
      setValidationError("Image must be JPEG, PNG, or GIF.")
      setImage(null)
    } else if (file.size > maxSize) {
      setValidationError("Image must be less than 1MB.")
      setImage(null)
    } else {
      setValidationError(null)
      setImage(file)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!image) {
      setValidationError("Please select an image.")
      return
    }
    const formData = new FormData()
    formData.append("image", image)
    try {
      const token = localStorage.getItem("SPPtoken")
      if (!token) {
        appDispatch({ type: "flashMessage", value: "Please log in as admin to manage images" })
        return
      }
      const response = await Axios.put(`/images/category/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      })
      appDispatch({
        type: "updateCategoryImage",
        data: { cat_id: parseInt(id), cat_img_path: response.data.cat_img_path }
      })
      appDispatch({ type: "flashMessage", value: "Category image updated successfully!" })
      navigate("/admin-category-put-select")
    } catch (e) {
      console.error("Image upload error:", e.response?.data || e.message)
      appDispatch({ type: "flashMessage", value: e.response?.data?.error || "Error updating image" })
    }
  }

  const handleCancel = () => {
    navigate("/admin-category-put-select")
  }

  return (
    <div className="wrapper">
      <div className="form">
        <h2>Update Category Image</h2>
        <form onSubmit={handleSubmit}>
          <div className="form__group">
            <label htmlFor="image" className="form__label">
              Category Image
            </label>
            <input type="file" name="image" onChange={handleFileChange} className="form__input" id="image" accept="image/jpeg,image/png,image/gif" />
            <small style={{ color: "$softWhite", opacity: 0.7 }}>Select one image (JPEG, PNG, GIF, max 1MB)</small>
            <CSSTransition in={!!validationError} timeout={330} classNames="flash-messages" unmountOnExit>
              <FlashMessages messages={[validationError]} />
            </CSSTransition>
          </div>
          <div className="form__group">
            <button type="submit" className="form__button" disabled={!!validationError || !image}>
              Update Image
            </button>
            <button type="button" className="form__button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminCategoryImagePost
