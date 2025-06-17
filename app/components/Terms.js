import React, { useEffect } from "react"
import Page from "./Page"
function Terms(props) {
  return (
    <Page title="Terms and Conditions">
      <div className="row">
        <div className="col-lg-8 offset-lg-2">
          <h1 className="display-4">Terms and Conditions</h1>
          <p className="lead text-muted">Last updated: October 2023</p>
          <p>Welcome to Sherman Peck Productions. By accessing our website, you agree to comply with and be bound by the following terms and conditions:</p>
          <ul>
            <li>Use of this site is at your own risk.</li>
            <li>All content provided on this site is for informational purposes only.</li>
            <li>We reserve the right to modify these terms at any time.</li>
          </ul>
          <p>If you have any questions about these terms, please contact us.</p>
        </div>
      </div>
    </Page>
  )
}
export default Terms
