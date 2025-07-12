import React, { useEffect } from "react";
import Page from "./Page";
function Terms(props) {
  return (
    <Page title="Terms and Conditions">
      <div className="wrapper wrapper--dark wrapper--center">
        <h1>Terms and Conditions</h1>
        <p className="lead text-muted">
          Last updated: July-{new Date().getFullYear()}
        </p>
        <p>
          Welcome to Sherman Peck Productions. By accessing our website, you
          agree to comply with and be bound by the following terms and
          conditions:
        </p>
        <ul>
          <li>Use of this site is at your own risk.</li>
          <li>
            All content provided on this site is for informational purposes
            only.
          </li>
          <li>We reserve the right to modify these terms at any time.</li>
        </ul>
        <p>If you have any questions about these terms, please contact us.</p>
      </div>
    </Page>
  );
}
export default Terms;
