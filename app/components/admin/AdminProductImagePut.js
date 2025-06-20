import React, { useState, useEffect } from "react"
import axios from "axios"
import { useParams, useNavigate, useLocation } from "react-router-dom"

function AdminProductImagePut() {
  const { id } = useParams() // Get image ID from URL
  const navigate = useNavigate()
  const location = useLocation()
  const [image, setImage] = useState({ img_desc: "", img_order: 0, img_media: 0, img_path: "" })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState("")

  useEffect(() => {
    async function fetchImage() {
      try {
        console.log("Fetching image with ID:", id) // Debug
        const token = localStorage.getItem("SPPtoken")
        if (!token) {
          setError("Please log in as admin to edit images")
          setLoading(false)
          return
        }
        const response = await axios.get(`/images/${id}`, {
          // Correct endpoint for single image
          headers: { Authorization: `Bearer ${token}` }
        })
        console.log("API Response:", response.data) // Debug API data
        setImage({
          img_desc: response.data.img_desc || "",
          img_order: response.data.img_order || 0,
          img_media: response.data.img_media || 0,
          img_path: response.data.img_path || ""
        })
        console.log("Set image state:", image) // Debug state after update
        setLoading(false)
      } catch (e) {
        setError(e.response ? e.response.data.error || "Image not found" : "Error fetching image")
        console.error("Fetch error:", e.response ? e.response.status : e.message) // Debug error with status
        const productId = location.state?.productId
        setTimeout(() => navigate(`/admin-product-image-put-select/${productId}`), 1000) // Fallback
        setLoading(false)
      }
    }
    fetchImage()
  }, [id])

  const handleChange = e => {
    const { name, value } = e.target
    setImage(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    console.log("Submitting image data:", image) // Debug
    const updatedData = {
      img_desc: image.img_desc,
      img_order: parseInt(image.img_order) || 0,
      img_media: parseInt(image.img_media) || 0
    }
    console.log("Parsed data:", updatedData) // Debug
    if (isNaN(updatedData.img_order) || isNaN(updatedData.img_media)) {
      setError("Order and Media Type must be valid numbers")
      return
    }
    try {
      const token = localStorage.getItem("SPPtoken")
      const response = await axios.put(`/images/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMessage("Image updated successfully")
      const productId = location.state?.productId
      setTimeout(() => navigate(`/admin-product-image-put-select/${productId}`), 1000)
    } catch (e) {
      setError(e.response ? e.response.data.error : "Error updating image")
      console.error("Update error:", e) // Debug
    }
  }

  const handleCancel = () => {
    const productId = location.state?.productId
    navigate(`/admin-product-image-put-select/${productId}`)
  }

  if (loading) return <p style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }}>Loading...</p>
  if (error)
    return (
      <div className="container mt-5">
        <h2 style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 700 }}>Edit Image</h2>
        <p style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }} className="text-danger">
          {error}
        </p>
        <button onClick={() => navigate(`/admin-product-image-put-select/${location.state?.productId}`)} className="btn btn-secondary mt-3">
          Back to Image Management
        </button>
      </div>
    )

  return (
    <div className="container mt-5">
      <h2 style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 700 }}>Editing: {image.img_path}</h2>
      {message && (
        <p style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }} className="text-success">
          {message}
        </p>
      )}
      {/* Display the image */}
      {image.img_path && (
        <div className="mb-4">
          <img
            src={`http://localhost:8080/${image.img_path}`} // Adjust path based on server configuration
            alt={image.img_name || "Image"}
            style={{ maxWidth: "300px", maxHeight: "300px", objectFit: "contain" }}
          />
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
