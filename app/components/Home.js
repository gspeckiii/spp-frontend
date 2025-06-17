import React, { useEffect, useContext } from "react"
import Page from "./Page"
import StateContext from "../StateContext.js"
function Home(props) {
  const appState = useContext(StateContext)
  return (
    <Page title="Home">
      <h1 className="text-center display-4">
        Hello <strong> {appState.user.username} </strong> Your feed is empty
      </h1>
      <p className="lead text-center text-muted">Currently your feed is empty but you can use the search bar to find other products or see what other users are into.</p>
    </Page>
  )
}

export default Home
