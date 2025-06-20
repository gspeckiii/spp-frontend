import React, { useState } from "react"
import Page from "./Page"

function HomeGuest() {
  return (
    <Page title="Landing" wide={true}>
      <div className="row align-items-center">
        <div className="col-lg-7 py-3 py-md-5">
          <h1 className="display-3">Sherman Peck Productions</h1>
          <p className="lead text-muted">I appreciate you for visiting my website and taking some time to view my work. I have organized my products by categories for your browsing pleasure. I hope you find a treasure or two for yourself or a family member or friend. Sharing is caring and contibuting to an artist will not only benefit my passion but hopfully lighten up your life.</p>
        </div>
      </div>
    </Page>
  )
}

export default HomeGuest
