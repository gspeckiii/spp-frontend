import React from "react"
import { Link } from "react-router-dom"

function AdminDashboard() {
  return (
    <div className="container mt-5">
      <h2 style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 700 }}>Admin Dashboard</h2>
      <div className="row">
        <div className="col-md-4 mb-3">
          <Link to="/admin-category-post" className="btn btn-primary btn-lg btn-block">
            Add Category
          </Link>
        </div>
        <div className="col-md-4 mb-3">
          <Link to="/admin-category-put-select" className="btn btn-primary btn-lg btn-block">
            Lookup Categories to Edit
          </Link>
        </div>
        <div className="col-md-4 mb-3">
          <Link to="/admin/images/add" className="btn btn-primary btn-lg btn-block" disabled>
            Add Image (Coming Soon)
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
