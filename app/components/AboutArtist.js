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
          <hr className="page-content--line-break" />
          <ul className="page-content--link-list">
            <li>
              <Link to="/about-family">Family</Link>
            </li>
            <li>
              <Link to="/about-history">Art History</Link>
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
            Art is the essential language of experience. I see it as a bridge
            connecting our present lives to the past, providing a way to honor
            those who came before us while leaving behind a meaningful legacy.
            My work explores truths that exist beyond the simple frameworks of
            good and evil, using the creative act as a tool for radical
            self-confrontation. The driving forces behind my practice are a
            relentless curiosity and a dedication to honing my craft. I find
            profound fulfillment in technical development and the pleasure of
            exploration. Ultimately, my aspiration is to tend to this creative
            spirit with hope and sincerity, contributing something of lasting
            value as a keeper of the flame.
          </p>
        </div>
      </div>
    </Page>
  );
}

export default AboutArtist;
