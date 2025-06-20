import React, { useState, useEffect } from "react"
import axios from "axios"
import { useParams, useNavigate, useLocation, Link } from "react-router-dom"

function AdminProductImagePutSelect() {
  const { id } = useParams() // Get product ID
  const navigate = useNavigate()
  const location = useLocation()
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState("")
  const [productName, setProductName] = useState("")

  useEffect(() => {
    console.log("Fetching images for product ID:", id) // Debug
    async function fetchImages() {
      try {
        const token = localStorage.getItem("SPPtoken")
        if (!token) {
          setError("Please log in as admin to manage images")
          setLoading(false)
          return
        }
        if (!id || isNaN(id)) {
          setError("Invalid product ID")
          setLoading(false)
          return
        }
        const response = await axios.get(`/images/product/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        console.log("API Response:", response.data) // Debug API data
        setImages(response.data)
        const productResponse = await axios.get(`/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setProductName(productResponse.data.prod_name || "Unknown Product")
        setLoading(false)
      } catch (e) {
        setError(e.response ? e.response.data.error || "Image data not found" : "Error fetching images")
        console.error("Fetch error:", e) // Debug error
        setLoading(false)
      }
    }
    fetchImages()
  }, [id])

  const handleDelete = async imageId => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        const token = localStorage.getItem("SPPtoken")
        await axios.delete(`/images/${imageId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setImages(images.filter(img => img.id !== imageId))
        setMessage("Image deleted successfully")
      } catch (e) {
        setError(e.response ? e.response.data.error : "Error deleting image")
      }
    }
  }

  const handleEdit = imageId => {
    navigate(`/admin-product-image-put/${imageId}`, { state: { categoryId: location.state?.categoryId, productId: id } })
  }

  if (loading) return <p style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }}>Loading...</p>
  if (error)
    return (
      <div className="container mt-5">
        <h2 style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 700 }}>Manage Images</h2>
        <p style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }} className="text-danger">
          {error}
        </p>
        <button onClick={() => navigate(`/admin-product-put-select/${location.state?.categoryId || id}`)} className="btn btn-secondary mt-3">
          Back to Products
        </button>
      </div>
    )
  if (images.length === 0)
    return (
      <div className="container mt-5">
        <h2 style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 700 }}>Manage Images for {productName}</h2>
        <p style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }}>No images available.</p>
        <button onClick={() => navigate(`/admin-product-put-select/${location.state?.categoryId}`)} className="btn btn-secondary mt-3">
          Back to Products
        </button>
      </div>
    )

  return (
    <div className="container mt-5">
      <h2 style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 700 }}>Manage Images for {productName}</h2>
      {message && (
        <p style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }} className="text-success">
          {message}
        </p>
      )}
      <table className="table table-striped">
        <thead>
          <tr>
            <th style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }}>Thumbnail</th>
            <th style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }}>Image Name</th>
            <th style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }}>Description</th>
            <th style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }}>Order</th>
            <th style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }}>Media Type</th>
            <th style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {images.map(image => (
            <tr key={image.id}>
              <td>
                {image.img_path && (
                  <img
                    src={`http://localhost:8080/${image.img_path}`}
                    alt={image.img_name || "Thumbnail"}
                    style={{ maxWidth: "100px", maxHeight: "100px", objectFit: "contain" }}
                    onError={e => {
                      e.target.style.display = "none"
                      console.log("Thumbnail load failed:", image.img_path)
                    }}
                  />
                )}
              </td>
              <td>{image.img_name}</td>
              <td>{image.img_desc || "No description"}</td>
              <td>{image.img_order}</td>
              <td>{image.img_media}</td>
              <td>
                <Link to={`/admin-product-image-put/${image.id}`} state={{ categoryId: location.state?.categoryId, productId: id }}>
                  <button className="btn btn-primary btn-sm mr-2">Edit</button>
                </Link>
                <button onClick={() => handleDelete(image.id)} className="btn btn-danger btn-sm">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => navigate(`/admin-product-put-select/${location.state?.categoryId || id}`)} className="btn btn-secondary mt-3">
        Back to Products
      </button>
    </div>
  )
}

export default AdminProductImagePutSelect
