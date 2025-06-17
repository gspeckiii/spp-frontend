import React, { useState, useReducer, useEffect } from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useImmerReducer } from "use-immer"
import axios from "axios"
import StateContext from "./StateContext.js"
import DispatchContext from "./DispatchContext.js"
import Header from "./components/Header.js"
import Home from "./components/Home.js"
import HomeGuest from "./components/HomeGuest.js"
import Footer from "./components/Footer.js"
import About from "./components/About.js"
import Terms from "./components/Terms.js"
import FlashMessages from "./components/FlashMessages.js"
import ResetPassword from "./components/ResetPassword.js"
import ResetPasswordRequest from "./components/ResetPasswordRequest"
import { refreshToken } from "./services/api"
axios.defaults.baseURL = "http://localhost:8080" // Should be lowercase 'axios'
function Main() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("SPPtoken")),
    flashMessages: [],
    user: {
      token: localStorage.getItem("SPPtoken"),
      username: localStorage.getItem("SPPusername"),
      avatar: localStorage.getItem("SPPavatar")
    }
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "logIn":
        draft.loggedIn = true
        draft.user = action.data
        return
      case "logOut":
        draft.loggedIn = false
        return
      case "flashMessage":
        draft.flashMessages.push(action.value)
        return
      case "refreshToken":
        draft.user.token = action.data.token
        return
      case "ResetEmail":
        draft.user.email = action.data.email
        return
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("SPPtoken", state.user.token)
      localStorage.setItem("SPPusername", state.user.username)
      localStorage.setItem("SPPavatar", state.user.avatar)
    } else {
      localStorage.removeItem("SPPtoken")
      localStorage.removeItem("SPPusername")
      localStorage.removeItem("SPPavatar")
    }
  }, [state.loggedIn, state.user.token, state.user.username, state.user.avatar])

  useEffect(() => {
    let refreshInterval
    if (state.loggedIn) {
      refreshInterval = setInterval(async () => {
        try {
          const response = await refreshToken()
          dispatch({ type: "refreshToken", data: response.data })
          console.log("Token refreshed")
        } catch (error) {
          console.error("Token refresh error:", error)
        }
      }, 30 * 60 * 1000) // Refresh every 30 minutes
    }
    return () => clearInterval(refreshInterval)
  }, [state.loggedIn])

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header />
          <Routes>
            <Route path="/" element={state.loggedIn ? <Home /> : <HomeGuest />} />

            <Route path="/about-us" element={<About />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/reset-password-request" element={<ResetPasswordRequest />} />
            <Route path="*" element={<h1 className="text-center">404 Page Not Found</h1>} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

const root = ReactDOM.createRoot(document.querySelector("#app"))
root.render(<Main />)
