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
import RequestPasswordReset from "./components/ResetPasswordRequest"
import ResetPassword from "./components/ResetPassword"
import Register from "./components/Register" // New import
import AdminCategoryPost from "./components/admin/AdminCategoryPost.js"
import AdminDashboard from "./components/admin/AdminDashboard.js"
import AdminCategoryPutSelect from "./components/admin/AdminCategoryPutSelect.js"
import AdminCategoryPut from "./components/admin/AdminCategoryPut.js"
import AdminProductPutSelect from "./components/admin/AdminProductPutSelect.js"
import AdminProductPost from "./components/admin/AdminProductPost.js"
import AdminProductPut from "./components/admin/AdminProductPut.js"

axios.defaults.baseURL = "http://localhost:8080" // Ensure this is set
function Main() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("SPPtoken")),
    flashMessages: [],
    user: {
      token: localStorage.getItem("SPPtoken"),
      username: localStorage.getItem("SPPusername"),
      avatar: localStorage.getItem("SPPavatar"),
      bio: localStorage.getItem("SPPbio"),
      admin: Boolean(localStorage.getItem("SPPadmin"))
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
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("SPPtoken", state.user.token)
      localStorage.setItem("SPPusername", state.user.username)
      localStorage.setItem("SPPavatar", state.user.avatar)
      localStorage.setItem("SPPadmin", state.user.admin)
      localStorage.setItem("SPPbio", state.user.bio)
    } else {
      localStorage.removeItem("SPPtoken")
      localStorage.removeItem("SPPusername")
      localStorage.removeItem("SPPavatar")
      localStorage.removeItem("SPPadmin")
      localStorage.removeItem("SPPbio")
    }
  }, [state.loggedIn, state.user.token, state.user.username, state.user.avatar, state.user.admin, state.user.bio])

  useEffect(() => {
    let refreshInterval
    if (state.loggedIn) {
      refreshInterval = setInterval(async () => {
        try {
          const response = await axios.post("/api/refresh")
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
            <Route path="/request-password-reset" element={<RequestPasswordReset />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin-dashboard" element={state.loggedIn && state.user.admin ? <AdminDashboard /> : <HomeGuest />} />
            <Route path="/admin-category-post" element={state.loggedIn && state.user.admin ? <AdminCategoryPost /> : <HomeGuest />} />
            <Route path="/admin-category-put-select" element={state.loggedIn && state.user.admin ? <AdminCategoryPutSelect /> : <HomeGuest />} />
            <Route path="/admin-category-put/:id" element={state.loggedIn && state.user.admin ? <AdminCategoryPut /> : <HomeGuest />} />
            <Route path="/admin-product-post/:id" element={state.loggedIn && state.user.admin ? <AdminProductPost /> : <HomeGuest />} />
            <Route path="/admin-product-put-select/:id" element={state.loggedIn && state.user.admin ? <AdminProductPutSelect /> : <HomeGuest />} />
            <Route path="/admin-product-put/:id" element={state.loggedIn && state.user.admin ? <AdminProductPut /> : <HomeGuest />} />
            <Route path="/about-us" element={<About />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/home" element={state.loggedIn ? <Home /> : <HomeGuest />} />
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
