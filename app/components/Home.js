import React, { useEffect, useContext } from "react"
import Page from "./Page"
import StateContext from "../StateContext.js"
function Home(props) {
  const appState = useContext(StateContext)
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
          <h1 className="large-hero__title">Sherman Peck Productions</h1>
          <h2 className="large-hero__subtitle">Welcome back, I hope you will find something below </h2>
          <p className="large-hero__description">All products are made with love and hope for better days</p>
          <p></p>
        </div>
      </div>
    </div>
  )
}

export default Home

/*
    <div className="large-hero">
      <picture>
        <source srcSet="assets/images/hero--large.jpg 1920w, assets/images/hero--large-hi-dpi.jpg 3840w" media="(min-width: 1380px)" />
        <source srcSet="assets/images/hero--medium.jpg 1380w, assets/images/hero--medium-hi-dpi.jpg 2760w" media="(min-width: 990px)" />
        <source srcSet="assets/images/hero--small.jpg 990w, assets/images/hero--small-hi-dpi.jpg 1980w" media="(min-width: 640px)" />
        <img srcSet="assets/images/hero--smaller.jpg 640w, assets/images/hero--smaller-hi-dpi.jpg 1280w" src="assets/images/hero--smaller.jpg" alt="Coastal view of ocean and mountains" className="large-hero__image" />
      </picture>

      <div className="large-hero__text-content">
        <div className="wrapper">
         








        
          <p></p>
        </div>
      </div>
    </div>
*/
