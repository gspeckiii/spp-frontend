// AboutArtist.js (THE FINAL, DIRECT, AND UNBREAKABLE VERSION)

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import profileImage from "../assets/images/Profile.png";

function AboutArtist() {
  // This component manages its own title and scroll behavior.
  useEffect(() => {
    document.title = "About Us | SPP";
    window.scrollTo(0, 0);
  }, []);

  return (
    // This div is rendered directly inside the simple `.page-content` frame.
    // It has the precise classes needed to trigger the black background
    // and the two-column layout from _container.css.
    <>
      <div className="container container--two-column">
        {/* --- COLUMN 1 --- */}
        <div className="container__column-left">
          <img
            className="container__image"
            src={profileImage}
            alt="A professional headshot"
          />
          <h1 className="container__heading-main">George Sherman Peck III</h1>
          <h2 className="container__heading-sub">Born · May 23, 1978</h2>
          <h2 className="container__heading-sub">Evansville · IN</h2>

          <hr className="container__line-break" />
          <ul className="container__link-list">
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
          <hr className="container__line-break" />
        </div>

        {/* --- COLUMN 2 --- */}
        <div className="container__column-right container__column-right--v-center">
          <p className="container__text-block">
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
      <div className="container__wrapper--narrow">
        <Link
          className="form__button"
          to="/"
          style={{ display: "inline-block", width: "auto", margin: "2rem 0" }}
        >
          Collections
        </Link>
      </div>
    </>
  );
}

export default AboutArtist;
