import React, { useState, useEffect, useContext } from "react"
import Axios from "axios"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"

function AdminProductImagePost() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState(null)

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
    setImages(Array.from(e.target.files))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (images.length === 0) {
      appDispatch({ type: "flashMessage", value: "Please select at least one image" })
      return
    }

    const formData = new FormData()
    images.forEach(image => formData.append("image", image))

    try {
      const token = localStorage.getItem("SPPtoken")
      const response = await Axios.post(`/images/product/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      })
      console.log("Add images response:", response.data)
      appDispatch({
        type: "incrementImgCount",
        data: { productId: parseInt(id), count: response.data.count || images.length }
      })
      appDispatch({ type: "flashMessage", value: "Images added successfully!" })
      if (!product?.cat_fk) {
        console.warn("No cat_fk found, using location.state.categoryId or redirecting to dashboard")
      }
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
    <div className="container mt-5">
      <h2 style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 700 }}>Add Images to {product?.prod_name || "Unknown Product"}</h2>
      <form onSubmit={handleSubmit} className="needs-validation" noValidate>
        <div className="form-group">
          <label htmlFor="images" style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }}>
            Product Images
          </label>
          <input type="file" name="images" onChange={handleFileChange} className="form-control-file" multiple />
          <small className="form-text text-muted">Select multiple images (JPEG, PNG, GIF, max 1MB each)</small>
        </div>
        <div className="d-flex justify-content-between mt-4">
          <button type="submit" className="btn btn-primary btn-lg" disabled={images.length === 0}>
            Add Images
          </button>
          <button type="button" className="btn btn-secondary btn-lg" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminProductImagePost
