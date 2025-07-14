import React, { useEffect } from "react";
import Page from "./Page";
function About() {
  return (
    <Page title="About Us">
      <div className="wrapper wrapper--dark wrapper--center">
        <h1 classname="">About Us</h1>
        <p>Last updated: October 2023</p>
        <p>
          Welcome to Sherman Peck Productions. We are dedicated to creating
          engaging and innovative content that inspires and entertains.
        </p>
        <p>
          Our team is passionate about storytelling and committed to delivering
          high-quality productions.
        </p>
        <p>
          If you have any questions or would like to collaborate, please contact
          us.
        </p>
      </div>
    </Page>
  );
}
export default About;
