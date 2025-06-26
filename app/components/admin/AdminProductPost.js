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
    <div className="wrapper">
      <div className="form">
        <h2>Add Product to {categoryName}</h2>
        <form onSubmit={handleSubmit} className="needs-validation" noValidate>
          <div className="form__group">
            <label htmlFor="prod_name" className="form_label">
              Product Name
            </label>
            <input type="text" name="prod_name" value={product.prod_name} onChange={handleChange} className="form__input" required />
            <div className="invalid-feedback">Please provide a product name.</div>
          </div>
          <div className="form__group">
            <label htmlFor="prod_desc" className="form_label">
              Description
            </label>
            <input type="text" name="prod_desc" value={product.prod_desc} onChange={handleChange} className="form__input" required />
            <div className="invalid-feedback">Please provide a description.</div>
          </div>
          <div className="form__group">
            <label htmlFor="prod_cost" className="form_label">
              Cost
            </label>
            <input type="number" name="prod_cost" value={product.prod_cost} onChange={handleChange} className="form__input" step="0.01" required />
            <div className="invalid-feedback">Please provide a valid cost.</div>
          </div>

          <div className="d-flex justify-content-between mt-4">
            <button type="submit" className="form__button">
              Add Product
            </button>
            <button type="button" className="form__button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminProductPost
