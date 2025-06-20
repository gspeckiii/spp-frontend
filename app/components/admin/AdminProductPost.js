import React, { useState, useEffect, useContext } from "react"
import Axios from "axios"
import { useParams, useNavigate, Link } from "react-router-dom"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"

function AdminProductPost() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const [product, setProduct] = useState({ prod_name: "", prod_desc: "", prod_cost: "", cat_fk: id || "" })
  const [categoryName, setCategoryName] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchCategory() {
      try {
        const token = localStorage.getItem("SPPtoken")
        if (!token) {
          setError("Please log in as admin to add products")
          setLoading(false)
          return
        }
        const response = await Axios.get(`/categories/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setCategoryName(response.data.cat_name || "Unknown Category")
        setLoading(false)
      } catch (e) {
        setError(e.response ? e.response.data.error : "Error fetching category")
        setLoading(false)
      }
    }
    fetchCategory()
  }, [id])

  const handleChange = e => {
    const { name, value } = e.target
    setProduct(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("SPPtoken")
      if (!token) {
        appDispatch({ type: "flashMessage", value: "Please log in as admin to add products" })
        return
      }
      const response = await Axios.post("/products", product, {
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log("Create product response:", response.data)
      appDispatch({ type: "incrementProdCount", data: parseInt(id) })
      appDispatch({ type: "flashMessage", value: "Product added successfully!" })
      setProduct({ prod_name: "", prod_desc: "", prod_cost: "", cat_fk: id })
      navigate(`/admin-product-put-select/${id}`)
    } catch (e) {
      appDispatch({ type: "flashMessage", value: e.response ? e.response.data.error : "Error adding product" })
    }
  }

  const handleCancel = () => {
    navigate(`/admin-product-put-select/${id}`)
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
      <h2 style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 700 }}>Add Product to {categoryName}</h2>
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
        <div className="form-group">
          <label htmlFor="cat_fk" style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }}>
            Category ID
          </label>
          <input type="number" name="cat_fk" value={product.cat_fk} readOnly className="form-control form-control-lg" required />
          <div className="invalid-feedback">Category ID is pre-set.</div>
        </div>
        <div className="d-flex justify-content-between mt-4">
          <button type="submit" className="btn btn-primary btn-lg">
            Add Product
          </button>
          <button type="button" className="btn btn-secondary btn-lg" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminProductPost
