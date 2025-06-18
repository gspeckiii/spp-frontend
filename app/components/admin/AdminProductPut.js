import React, { useState, useEffect } from "react"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"

function AdminProductPut() {
  const { id } = useParams() // Get product ID from URL
  const navigate = useNavigate()
  const [product, setProduct] = useState({ prod_name: "", prod_desc: "", prod_cost: "", cat_fk: "" })
  const [categoryName, setCategoryName] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState("")

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("SPPtoken")
        if (!token) {
          setError("Please log in as admin to edit products")
          setLoading(false)
          return
        }

        // Fetch product
        const productResponse = await axios.get(`/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const fetchedProduct = {
          prod_name: productResponse.data.prod_name,
          prod_desc: productResponse.data.prod_desc || "",
          prod_cost: productResponse.data.prod_cost || "",
          cat_fk: productResponse.data.cat_fk || ""
        }

        // Fetch category name
        if (fetchedProduct.cat_fk) {
          const categoryResponse = await axios.get(`/api/categories/${fetchedProduct.cat_fk}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          setCategoryName(categoryResponse.data.cat_name || "Unknown Category")
        }

        setProduct(fetchedProduct)
        setLoading(false)
      } catch (e) {
        setError(e.response ? e.response.data.error : "Error fetching data")
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleChange = e => {
    const { name, value } = e.target
    setProduct(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("SPPtoken")
      const response = await axios.put(`/api/products/${id}`, product, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMessage("Product updated successfully")
      setTimeout(() => navigate(`/admin-product-put-select/${product.cat_fk}`), 1000) // Redirect to product list for the category
    } catch (e) {
      setError(e.response ? e.response.data.error : "Error updating product")
    }
  }

  const handleCancel = () => {
    navigate(`/admin-product-put-select/${product.cat_fk}`) // Cancel and return without saving
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
      <h2 style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 700 }}>Edit Product in {categoryName}</h2>
      {message && (
        <p style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }} className="text-success">
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit} className="needs-validation" noValidate>
        <div className="form-group">
          <label htmlFor="prod_name" style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }}>
            Product Name
          </label>
          <input type="text" name="prod_name" value={product.prod_name} onChange={handleChange} className="form-control form-control-lg" required />
          <div className="invalid-feedback">Please provide a product name.</div>
        </div>
        <div className="form-group">
          <label htmlFor="prod_desc" style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }}>
            Description
          </label>
          <input type="text" name="prod_desc" value={product.prod_desc} onChange={handleChange} className="form-control form-control-lg" required />
          <div className="invalid-feedback">Please provide a description.</div>
        </div>
        <div className="form-group">
          <label htmlFor="prod_cost" style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }}>
            Cost
          </label>
          <input type="number" name="prod_cost" value={product.prod_cost} onChange={handleChange} className="form-control form-control-lg" step="0.01" required />
          <div className="invalid-feedback">Please provide a valid cost.</div>
        </div>

        <div className="d-flex justify-content-between mt-4">
          <button type="submit" className="btn btn-primary btn-lg">
            Update Product
          </button>
          <button type="button" className="btn btn-secondary btn-lg" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminProductPut
