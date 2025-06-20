import React, { useState, useEffect, useContext } from "react"
import Axios from "axios"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"

function AdminProductImagePut() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const [image, setImage] = useState({ img_desc: "", img_order: 0, img_media: 0, img_path: "" })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchImage() {
      try {
        console.log("Fetching image with ID:", id)
        const token = localStorage.getItem("SPPtoken")
        if (!token) {
          appDispatch({ type: "flashMessage", value: "Please log in as admin to edit images" })
          setLoading(false)
          return
        }
        const response = await Axios.get(`/images/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        console.log("API Response:", response.data)
        setImage({
          img_desc: response.data.img_desc || "",
          img_order: response.data.img_order || 0,
          img_media: response.data.img_media || 0,
          img_path: response.data.img_path || ""
        })
        setLoading(false)
      } catch (e) {
        appDispatch({ type: "flashMessage", value: e.response ? e.response.data.error || "Image not found" : "Error fetching image" })
        console.error("Fetch error:", e.response ? e.response.status : e.message)
        const productId = location.state?.productId
        navigate(productId ? `/admin-product-image-put-select/${productId}` : "/admin-category-put-select")
        setLoading(false)
      }
    }
    fetchImage()
  }, [id, appDispatch, navigate, location.state])

  const handleChange = e => {
    const { name, value } = e.target
    setImage(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    console.log("Submitting image data:", image)
    const updatedData = {
      img_desc: image.img_desc,
      img_order: parseInt(image.img_order) || 0,
      img_media: parseInt(image.img_media) || 0
    }
    console.log("Parsed data:", updatedData)
    if (isNaN(updatedData.img_order) || isNaN(updatedData.img_media)) {
      appDispatch({ type: "flashMessage", value: "Order and Media Type must be valid numbers" })
      return
    }
    try {
      const token = localStorage.getItem("SPPtoken")
      const response = await Axios.put(`/images/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log("Update image response:", response.data)
      appDispatch({ type: "flashMessage", value: "Image updated successfully!" })
      const productId = location.state?.productId
      navigate(productId ? `/admin-product-image-put-select/${productId}` : "/admin-category-put-select")
    } catch (e) {
      appDispatch({ type: "flashMessage", value: e.response ? e.response.data.error : "Error updating image" })
      console.error("Update error:", e)
    }
  }

  const handleCancel = () => {
    const productId = location.state?.productId
    navigate(productId ? `/admin-product-image-put-select/${productId}` : "/admin-category-put-select")
  }

  if (loading) return <p style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }}>Loading...</p>

  return (
    <div className="container mt-5">
      <h2 style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 700 }}>Editing: {image.img_path}</h2>
      {image.img_path && (
        <div className="mb-4">
          <img src={`http://localhost:8080/${image.img_path}`} alt={image.img_desc || "Image"} style={{ maxWidth: "300px", maxHeight: "300px", objectFit: "contain" }} />
        </div>
      )}
      <form onSubmit={handleSubmit} className="needs-validation" noValidate>
        <div className="form-group">
          <label htmlFor="img_desc" style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }}>
            Image Description
          </label>
          <input type="text" name="img_desc" value={image.img_desc} onChange={handleChange} className="form-control form-control-lg" required />
          <div className="invalid-feedback">Please provide an image description.</div>
        </div>
        <div className="form-group">
          <label htmlFor="img_order" style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }}>
            Image Order
          </label>
          <input type="number" name="img_order" value={image.img_order} onChange={handleChange} className="form-control form-control-lg" min="0" required />
        </div>
        <div className="form-group">
          <label htmlFor="img_media" style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }}>
            Media Type
          </label>
          <input type="number" name="img_media" value={image.img_media} onChange={handleChange} className="form-control form-control-lg" min="0" required />
        </div>
        <div className="d-flex justify-content-between mt-4">
          <button type="submit" className="btn btn-primary btn-lg">
            Update Image
          </button>
          <button type="button" className="btn btn-secondary btn-lg" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminProductImagePut
