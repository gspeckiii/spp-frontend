import React, { useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import Page from "./Page"
import StateContext from "../StateContext.js"
import CategorySlider from "./CategorySlider"
function Home(props) {
  const appState = useContext(StateContext)

  return (
    <Page title="Home">
      <div className="page-content">
        <h1 className="page-content__content page__content--header">{appState.user.username}</h1>

        <CategorySlider />
      </div>
    </Page>
  )
}

export default Home
