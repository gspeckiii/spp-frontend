import React from "react";
import { Link } from "react-router-dom";

// Make sure you import your CSS file
// import '../styles/_dashboard.scss'; // Or .css if compiled

function AdminDashboardContent() {
  return (
    <div className="page-section page-section--background">
      <div className="wrapper">
        <div className="dashboard">
          <h2 className="dashboard__heading">Admin Dashboard</h2>
          <div className="dashboard__row">
            <div className="dashboard__col">
              <Link to="/admin-category-post" className="dashboard__button">
                Add Category
              </Link>
            </div>
            <div className="dashboard__col">
              <Link
                to="/admin-category-put-select"
                className="dashboard__button"
              >
                Lookup Categories to Edit
              </Link>
            </div>
            <div className="dashboard__col">
              <Link to="/admin/printful-sync" className="dashboard__button">
                Sync Printful Products
              </Link>
            </div>
            <div className="dashboard__col">
              <Link to="/admin-order" className="dashboard__button">
                Manage Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardContent;
