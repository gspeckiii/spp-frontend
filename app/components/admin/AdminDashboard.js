import React from "react"
import { Link } from "react-router-dom"

// Make sure you import your CSS file
// import '../styles/_dashboard.scss'; // Or .css if compiled

function AdminDashboardContent() {
  return (
    <div className="large-hero">
      <picture>
        <source srcSet="assets/images/hero--large.jpg 1920w, assets/images/hero--large-hi-dpi.jpg 3840w" media="(min-width: 1380px)" />
        <source srcSet="assets/images/hero--medium.jpg 1380w, assets/images/hero--medium-hi-dpi.jpg 2760w" media="(min-width: 990px)" />
        <source srcSet="assets/images/hero--small.jpg 990w, assets/images/hero--small-hi-dpi.jpg 1980w" media="(min-width: 640px)" />
        <img srcSet="assets/images/hero--smaller.jpg 640w, assets/images/hero--smaller-hi-dpi.jpg 1280w" src="assets/images/hero--smaller.jpg" alt="Coastal view of ocean and mountains" className="large-hero__image" />
      </picture>

      <div className="large-hero__text-content">
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
                <Link to="/admin-category-put-select" className="dashboard__button">
                  Lookup Categories to Edit
                </Link>
              </div>
              <div className="dashboard__col">
                <Link to="/admin/images/add" className="dashboard__button dashboard__button--disabled" disabled>
                  Add Image (Coming Soon)
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardContent
