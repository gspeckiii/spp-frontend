import React from "react";
import { Link } from "react-router-dom";
import Page from "./Page";
import profileImage from "../assets/images/Profile.png";

function AboutArtist() {
  return (
    <Page title="About Us">
      {/* This is the main flex container */}
      <div className="page-content--section">
        {/* --- COLUMN 1: IMAGE + HEADINGS --- */}
        <div className="page-content--left-column">
          <img
            className="page-content--image"
            src={profileImage}
            alt="A professional headshot"
          />
          <h1 className="page-content--h1">George Sherman Peck III</h1>
          <h2 className="page-content--h2">Born · May 23, 1978</h2>
          <h2 className="page-content--h2">Evansville · IN</h2>
        </div>

        {/* --- COLUMN 2: PARAGRAPH + LINKS --- */}
        <div className="page-content--right-column">
          <ul className="page-content--link-list">
            <li>
              <Link to="/about-family">Family</Link>
            </li>
            <li>
              <Link to="/about-kcai">Kansas City Art Institute</Link>
            </li>
            <li>
              <Link to="/about-engineer">MSU Engineer</Link>
            </li>
            <li>
              <Link to="/about-raven">Raven Marie Peck</Link>
            </li>
          </ul>
          <hr className="page-content--line-break" />
          <p className="page-content--p">
            Art is an expression of our experiences. From the day we are born
            our souls search from a way to honor those who came before us and
            leave a legacy they would be proud of. Art can transend good and
            evil. The only tool we can use to free ourselves from ourselves.
            Stand toe to toe with a mirror pointed blankly at our soul. A risk
            that no matter the outcome will result in an experience we can learn
            from. To grow in skill is real fulfillment. To quench curiousity is
            the pleasure of lifetime. To live in hope and pass into the spirit
            world with a smile. A true keeper of the flame.
          </p>
        </div>
      </div>
    </Page>
  );
}

export default AboutArtist;
