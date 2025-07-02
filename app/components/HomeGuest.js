import React, { useEffect, useContext } from "react"
import Page from "./Page"
import StateContext from "../StateContext.js"
import CategorySlider from "./CategorySlider"
function Home(props) {
  const appState = useContext(StateContext)

  return (
    <Page title="Home">
      <div className="page-content">
        <h1 className="page-content__content"> Welcome to Sherman Peck Productions</h1>
        <CategorySlider />
      </div>
    </Page>
  )
}

export default Home
