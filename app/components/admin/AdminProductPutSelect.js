import React, { useState, useEffect, useContext } from "react"
import Axios from "axios"
import { Link, useParams } from "react-router-dom"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"

function AdminProductPutSelect() {
  const { id } = useParams()
  const { categories, user } = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const [category, setCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user.token) {
      setError("Please log in as admin to view products")
      setLoading(false)
      return
    }

    const categoryId = id
    console.log("Fetching data for category ID:", categoryId)

    if (!categoryId || isNaN(parseInt(categoryId))) {
      appDispatch({ type: "flashMessage", value: "Invalid or missing category ID" })
      setError("Invalid or missing category ID")
      setLoading(false)
      return
    }

    async function fetchData() {
      try {
        setLoading(true)
        console.log("Fetching category with ID:", categoryId)
        const categoryResponse = await Axios.get(`/categories/${categoryId}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        })
        console.log("Category response:", categoryResponse.data)
        setCategory(categoryResponse.data)

        console.log("Fetching products for category ID:", categoryId)
        const productsResponse = await Axios.get(`/products/category/${categoryId}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        })
        console.log("Products response:", productsResponse.data)
        setProducts(productsResponse.data)
        appDispatch({ type: "setProducts", data: productsResponse.data })
        setLoading(false)

        appDispatch({ type: "selectCategory", data: categoryResponse.data })
      } catch (e) {
        console.error("Fetch error:", e)
        appDispatch({ type: "flashMessage", value: e.response ? e.response.data.error : "Error fetching data" })
        setError(e.response ? e.response.data.error : "Error fetching data")
        setLoading(false)
      }
    }
    fetchData()
  }, [id, user.token, appDispatch])

  const handleDelete = async productId => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await Axios.delete(`/products/${productId}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        })
        setProducts(products.filter(prod => prod.id !== productId))
        appDispatch({ type: "decrementProdCount", data: parseInt(id) })
        appDispatch({ type: "flashMessage", value: "Product deleted successfully!" })
      } catch (e) {
        appDispatch({ type: "flashMessage", value: e.response ? e.response.data.error : "Error deleting product" })
      }
    }
  }

  if (!user.token) {
    return (
      <p style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: "400" }} className="text-danger">
        Please log in as admin to view products
      </p>
    )
  }

  if (loading) {
    return <p style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: "400" }}>Loading...</p>
  }

  if (error) {
    return (
      <p style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: "400" }} className="text-danger">
        {error}
      </p>
    )
  }

  return (
    <div className="container mt-5">
      <div className="mb-4">
        <h3 style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 700 }}>Add New Product</h3>
        <Link to={`/admin-product-post/${id}`} className="btn btn-success btn-lg">
          Add Product
        </Link>
      </div>

      <h2 style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: "700" }}>Products in Category: {category ? category.cat_name : "Unknown"}</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: "400" }}>Product Name</th>
            <th style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: "400" }}>Price</th>
            <th style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: "400" }}>Image Count</th>
            <th style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: "400" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.prod_name}</td>
              <td>${product.prod_cost || 0}</td>
              <td>{product.img_count || 0}</td>
              <td>
                <Link to={`/admin-product-put/${product.id}`} className="btn btn-primary btn-sm mr-2" style={{ marginRight: "10px" }}>
                  Edit
                </Link>
                {Number(product.img_count) === 0 && (
                  <button onClick={() => handleDelete(product.id)} className="btn btn-success btn-sm mr-2" style={{ marginRight: "10px" }}>
                    Delete
                  </button>
                )}
                <Link to={`/admin-product-image-post/${product.id}`} state={{ categoryId: id }} className="btn btn-info btn-sm mr-2" style={{ marginRight: "10px" }}>
                  Add Images
                </Link>
                <Link to={`/admin-product-image-put-select/${product.id}`} state={{ categoryId: id }} className="btn btn-secondary btn-sm">
                  Manage Images
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mb-3 back-button">
        <Link to="/admin-category-put-select" className="btn btn-secondary">
          Back to Categories
        </Link>
      </div>
    </div>
  )
}

export default AdminProductPutSelect
