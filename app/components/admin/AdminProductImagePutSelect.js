import React, { useState, useEffect, useContext } from "react"
import Axios from "axios"
import { useParams, useNavigate, useLocation, Link } from "react-router-dom"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"

function AdminProductImagePutSelect() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState(null)

  useEffect(() => {
    console.log("Fetching images for product ID:", id)
    async function fetchImages() {
      try {
        const token = localStorage.getItem("SPPtoken")
        if (!token) {
          appDispatch({ type: "flashMessage", value: "Please log in as admin to manage images" })
          setLoading(false)
          return
        }
        if (!id || isNaN(id)) {
          appDispatch({ type: "flashMessage", value: "Invalid product ID" })
          setLoading(false)
          return
        }
        const productResponse = await Axios.get(`/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        console.log("Product response:", productResponse.data)
        setProduct({
          id: parseInt(id),
          prod_name: productResponse.data.prod_name || "Unknown Product",
          cat_fk: productResponse.data.cat_fk
        })

        const imagesResponse = await Axios.get(`/images/product/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        console.log("Images response:", imagesResponse.data)
        setImages(imagesResponse.data)
        setLoading(false)
      } catch (e) {
        appDispatch({ type: "flashMessage", value: e.response ? e.response.data.error || "Image data not found" : "Error fetching images" })
        console.error("Fetch error:", e)
        setLoading(false)
      }
    }
    fetchImages()
  }, [id, appDispatch])

  const handleDelete = async imageId => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        const token = localStorage.getItem("SPPtoken")
        await Axios.delete(`/images/${imageId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setImages(images.filter(img => img.id !== imageId))
        appDispatch({
          type: "incrementImgCount",
          data: { productId: parseInt(id), count: -1 }
        })
        appDispatch({ type: "flashMessage", value: "Image deleted successfully!" })
      } catch (e) {
        appDispatch({ type: "flashMessage", value: e.response ? e.response.data.error : "Error deleting image" })
      }
    }
  }

  const handleEdit = imageId => {
    navigate(`/admin-product-image-put/${imageId}`, {
      state: { categoryId: product?.cat_fk || location.state?.categoryId, productId: id }
    })
  }

  if (loading) return <p>Loading...</p>
  if (!product)
    return (
      <div className="wrapper">
        <h2>Manage Images</h2>
        <p className="text-danger">Product not found</p>
        <Link to="/admin-category-put-select" className="form__button">
          Back to Categories
        </Link>
      </div>
    )

  return (
    <div className="table-select">
      <h2>Manage Images for {product.prod_name}</h2>
      {images.length === 0 ? (
        <p>No images available.</p>
      ) : (
        <table className="table-select__table">
          <thead>
            <tr>
              <th>Thumbnail</th>
              <th>Image Name</th>
              <th>Description</th>
              <th>Order</th>
              <th>Media Type</th>
              <th>Actions</th>
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
                  <button onClick={() => handleEdit(image.id)} className="table-select__button">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(image.id)} className="table-select__button">
                    Del
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Link to={`/admin-product-image-post/${id}`} state={{ categoryId: product?.cat_fk || location.state?.categoryId }} className="form__button">
        Add Images
      </Link>
      <Link to={`/admin-product-put-select/${product?.cat_fk || location.state?.categoryId || id}`} className="form__button">
        Back to Products
      </Link>
    </div>
  )
}

export default AdminProductImagePutSelect
