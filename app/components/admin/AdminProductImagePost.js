import React, { useState, useEffect } from "react"
import axios from "axios"
import { useParams, useNavigate, useLocation } from "react-router-dom"

function AdminProductImagePost() {
  const { id } = useParams() // Get the product ID (e.g., "7")
  const navigate = useNavigate()
  const location = useLocation()
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState("")
  const [productName, setProductName] = useState("")

  useEffect(() => {
    async function fetchProduct() {
      try {
        const token = localStorage.getItem("SPPtoken")
        if (!token) {
          setError("Please log in as admin to add images")
          setLoading(false)
          return
        }
        const response = await axios.get(`/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setProductName(response.data.prod_name || "Unknown Product")
        setLoading(false)
      } catch (e) {
        setError(e.response ? e.response.data.error : "Error fetching product")
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const handleFileChange = e => {
    setImages(Array.from(e.target.files))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (images.length === 0) {
      setError("Please select at least one image")
      return
    }

    const formData = new FormData()
    images.forEach(image => formData.append("image", image))

    try {
      const token = localStorage.getItem("SPPtoken")
      const response = await axios.post(`/images/product/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      })
      setMessage("Images added successfully")
      const categoryId = location.state?.categoryId // Get category ID from state
      setTimeout(() => navigate(`/admin-product-put-select/${categoryId || id}`), 1000) // Fallback to id if state is missing
    } catch (e) {
      setError(e.response ? e.response.data.error : "Error adding images")
    }
  }

  const handleCancel = () => {
    const categoryId = location.state?.categoryId // Get category ID from state
    navigate(`/admin-product-put-select/${categoryId || id}`) // Fallback to id if state is missing
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
      <h2 style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 700 }}>Add Images to {productName}</h2>
      {message && (
        <p style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }} className="text-success">
          {message}
        </p>
      )}
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
