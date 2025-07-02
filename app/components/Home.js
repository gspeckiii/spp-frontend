import React, { useEffect, useContext } from "react"
import Page from "./Page"
import StateContext from "../StateContext.js"
import CategorySlider from "./CategorySlider"
function Home(props) {
  const appState = useContext(StateContext)

  return (
    <Page title="Home">
      <div className="page-content">
        <p className="page-content__content">Hello, {appState.user.username} ! Explore our categories below. </p>
        <CategorySlider />
      </div>
    </Page>
  )
}

export default Home
