import React, { useState, useEffect } from "react"
import axios from "axios"
import { useParams, Link } from "react-router-dom"

function AdminProductPutSelect() {
  const { id } = useParams() // Get category ID from URL
  const [products, setProducts] = useState([])
  const [categoryName, setCategoryName] = useState("Unknown Category") // Default to "Unknown" if fetch fails
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("SPPtoken")
        if (!token) {
          setError("Please log in as admin to view products")
          setLoading(false)
          return
        }

        // Fetch category name with error handling
        try {
          const categoryResponse = await axios.get(`/api/categories/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          setCategoryName(categoryResponse.data.cat_name || "Unknown Category")
        } catch (categoryError) {
          console.warn("Category fetch failed for ID:", id, categoryError.message)
          setCategoryName(`Unknown Category (ID: ${id})`) // Fallback with ID for context
        }

        // Fetch products
        const productsResponse = await axios.get(`/api/products/category/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setProducts(productsResponse.data)
        setLoading(false)
      } catch (e) {
        setError(e.response ? e.response.data.error : "Error fetching data")
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleDelete = async id => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const token = localStorage.getItem("SPPtoken")
        await axios.delete(`/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setProducts(products.filter(prod => prod.id !== id))
      } catch (e) {
        setError(e.response ? e.response.data.error : "Error deleting product")
      }
    }
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
      {/* New Section for Adding Products */}
      <div className="mb-4">
        <h3 style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 700 }}>Add New Product</h3>
        <Link to={`/admin-product-post-${id}`} className="btn btn-success btn-lg">
          Add Product
        </Link>
      </div>

      {/* Updated Header with Category Name */}
      <h2 style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 700 }}>Select Product to Edit for Category: {categoryName}</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }}>ID</th>
            <th style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }}>Product Name</th>
            <th style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }}>Image Count</th>
            <th style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.prod_name}</td>
              <td>{product.img_count || 0}</td>
              <td>
                <Link to={`/admin-product-put/${product.id}`} className="btn btn-primary btn-sm mr-2">
                  Edit
                </Link>
                {Number(product.img_count) === 0 && (
                  <button onClick={() => handleDelete(product.id)} className="btn btn-danger btn-sm mr-2">
                    Delete
                  </button>
                )}
                <Link to={`/admin-product-image-post/${product.id}`} state={{ categoryId: id }} className="btn btn-info btn-sm">
                  Add Images
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminProductPutSelect
