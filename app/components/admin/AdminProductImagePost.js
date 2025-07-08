import React, { useState, useEffect, useContext,useRef } from "react"
import Axios from "axios"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"
import { CSSTransition } from "react-transition-group"
import FlashMessages from "../FlashMessages"

function AdminProductImagePost() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState(null)
  const [validationError, setValidationError] = useState(null)
  const flashRef = useRef(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const token = localStorage.getItem("SPPtoken")
        if (!token) {
          appDispatch({ type: "flashMessage", value: "Please log in as admin to add images" })
          setLoading(false)
          return
        }
        const response = await Axios.get(`/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setProduct({
          id: parseInt(id),
          prod_name: response.data.prod_name || "Unknown Product",
          cat_fk: response.data.cat_fk
        })
        setLoading(false)
      } catch (e) {
        appDispatch({ type: "flashMessage", value: e.response ? e.response.data.error : "Error fetching product" })
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id, appDispatch])

  const handleFileChange = e => {
    const files = Array.from(e.target.files)
    if (files.length === 0) {
      setValidationError("Please select at least one image.")
    } else {
      const validTypes = ["image/jpeg", "image/png", "image/gif"]
      const maxSize = 5 * 1024 * 1024 // 1MB
      const invalidFiles = files.filter(file => !validTypes.includes(file.type) || file.size > maxSize)
      if (invalidFiles.length > 0) {
        setValidationError("All images must be JPEG, PNG, or GIF and less than 5MB.")
      } else {
        setValidationError(null)
      }
    }
    setImages(files)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (images.length === 0) {
      setValidationError("Please select at least one image.")
      return
    }
    if (validationError) {
      return
    }

    const formData = new FormData()
    images.forEach(image => formData.append("image", image))

    try {
      const token = localStorage.getItem("SPPtoken")
      const response = await Axios.post(`/images/product/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      })
      appDispatch({
        type: "incrementImgCount",
        data: { productId: parseInt(id), count: response.data.count || images.length }
      })
      appDispatch({ type: "flashMessage", value: "Images added successfully!" })
      const categoryId = product?.cat_fk || location.state?.categoryId
      navigate(categoryId ? `/admin-product-put-select/${categoryId}` : "/admin-category-put-select")
    } catch (e) {
      appDispatch({ type: "flashMessage", value: e.response ? e.response.data.error : "Error adding images" })
    }
  }

  const handleCancel = () => {
    const categoryId = product?.cat_fk || location.state?.categoryId
    navigate(categoryId ? `/admin-product-put-select/${categoryId}` : "/admin-category-put-select")
  }

  if (loading) return <p style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }}>Loading...</p>

  return (
    <div className="wrapper">
      <div className="form">
        <h2>Add Images to {product?.prod_name || "Unknown Product"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form__group">
            <label htmlFor="images" className="form__label">
              Product Images
            </label>
            <input type="file" name="images" onChange={handleFileChange} className="form__input" id="images" multiple />
            <small style={{ color: "$softWhite", opacity: 0.7 }}>Select multiple images (JPEG, PNG, GIF, max 5MB each)</small>
            <CSSTransition in={!!validationError} timeout={330} classNames="flash-messages" unmountOnExit nodeRef={flashRef}>
              <div ref={flashRef}> {/* Attach the ref to a real DOM element */}
                <FlashMessages messages={[validationError]} />
              </div>
            </CSSTransition>
          </div>
          <div className="form__group">
            <button type="submit" className="form__button" disabled={!!validationError || images.length === 0}>
              Add Images
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

export default AdminProductImagePost
