import React, { useState, useReducer, useEffect } from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useImmerReducer } from "use-immer"
import Axios from "axios"
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
import Register from "./components/Register"
import AdminCategoryPost from "./components/admin/AdminCategoryPost.js"
import AdminDashboard from "./components/admin/AdminDashboard.js"
import AdminCategoryPutSelect from "./components/admin/AdminCategoryPutSelect.js"
import AdminCategoryPut from "./components/admin/AdminCategoryPut.js"
import AdminProductPutSelect from "./components/admin/AdminProductPutSelect.js"
import AdminProductPost from "./components/admin/AdminProductPost.js"
import AdminProductPut from "./components/admin/AdminProductPut.js"
import AdminProductImagePost from "./components/admin/AdminProductImagePost.js"
import AdminProductImagePut from "./components/admin/AdminProductImagePut.js"
import AdminProductImagePutSelect from "./components/admin/AdminProductImagePutSelect.js"

Axios.defaults.baseURL = "http://localhost:8080/api"
console.log("Axios baseURL set to:", Axios.defaults.baseURL)

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
    },
    categories: {
      list: [],
      selectedCategory: null,
      loading: false,
      error: null
    },
    products: []
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
      case "setCategories":
        // Ensure unique categories and parse prod_count as number
        draft.categories.list = Array.from(
          new Map(
            action.data.map(cat => [
              cat.cat_id,
              {
                ...cat,
                prod_count: parseInt(cat.prod_count) || 0
              }
            ])
          ).values()
        )
        draft.categories.loading = false
        draft.categories.error = null
        return
      case "selectCategory":
        draft.categories.selectedCategory = {
          ...action.data,
          prod_count: parseInt(action.data.prod_count) || 0
        }
        return
      case "deleteCategory":
        draft.categories.list = draft.categories.list.filter(cat => cat.cat_id !== action.data)
        if (draft.categories.selectedCategory?.cat_id === action.data) {
          draft.categories.selectedCategory = null
        }
        return
      case "updateCategory":
        const catIndex = draft.categories.list.findIndex(cat => cat.cat_id === action.data.cat_id)
        if (catIndex !== -1) {
          draft.categories.list[catIndex] = {
            ...action.data,
            prod_count: parseInt(action.data.prod_count) || 0
          }
        } else {
          console.warn("Category not found for update:", action.data.cat_id)
        }
        if (draft.categories.selectedCategory?.cat_id === action.data.cat_id) {
          draft.categories.selectedCategory = {
            ...action.data,
            prod_count: parseInt(action.data.prod_count) || 0
          }
        }
        return
      case "addCategory":
        draft.categories.list.push({
          ...action.data,
          prod_count: parseInt(action.data.prod_count) || 0
        })
        return
      case "incrementProdCount":
        const prodIndex = draft.categories.list.findIndex(cat => cat.cat_id === action.data)
        if (prodIndex !== -1) {
          draft.categories.list[prodIndex].prod_count = parseInt(draft.categories.list[prodIndex].prod_count || 0) + 1
        }
        if (draft.categories.selectedCategory?.cat_id === action.data) {
          draft.categories.selectedCategory.prod_count = parseInt(draft.categories.selectedCategory.prod_count || 0) + 1
        }
        return
      case "decrementProdCount":
        const decIndex = draft.categories.list.findIndex(cat => cat.cat_id === action.data)
        if (decIndex !== -1) {
          draft.categories.list[decIndex].prod_count = Math.max(parseInt(draft.categories.list[decIndex].prod_count || 0) - 1, 0)
        }
        if (draft.categories.selectedCategory?.cat_id === action.data) {
          draft.categories.selectedCategory.prod_count = Math.max(parseInt(draft.categories.selectedCategory.prod_count || 0) - 1, 0)
        }
        return
      case "setProducts":
        draft.products = Array.from(new Map(action.data.map(prod => [prod.id, prod])).values())
        return
      case "incrementImgCount":
        const imgIndex = draft.products.findIndex(prod => prod.id === action.data.productId)
        if (imgIndex !== -1) {
          draft.products[imgIndex].img_count = (parseInt(draft.products[imgIndex].img_count) || 0) + action.data.count
        }
        return
      case "setCategoryLoading":
        draft.categories.loading = true
        return
      case "setCategoryError":
        draft.categories.error = action.data
        draft.categories.loading = false
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
    const ourRequest = Axios.CancelToken.source()
    async function fetchCategories() {
      try {
        dispatch({ type: "setCategoryLoading" })
        const token = localStorage.getItem("SPPtoken")
        const response = await Axios.get("/categories", {
          headers: { Authorization: `Bearer ${token}` },
          cancelToken: ourRequest.token
        })
        console.log("Fetched categories:", response.data)
        dispatch({ type: "setCategories", data: response.data })
      } catch (e) {
        dispatch({ type: "setCategoryError", data: e.response ? e.response.data.error : "Error fetching categories" })
      }
    }
    if (state.user.token) {
      fetchCategories()
    }
    return () => ourRequest.cancel()
  }, [state.user.token])

  useEffect(() => {
    let refreshInterval
    if (state.loggedIn) {
      refreshInterval = setInterval(async () => {
        try {
          const response = await Axios.post("/refresh")
          dispatch({ type: "refreshToken", data: response.data })
          console.log("Token refreshed")
        } catch (error) {
          console.error("Token refresh error:", error)
        }
      }, 30 * 60 * 1000)
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
            <Route path="/admin-product-put-select/:id" element={state.loggedIn && state.user.admin ? <AdminProductPutSelect /> : <HomeGuest />} />
            <Route path="/admin-product-post/:id" element={state.loggedIn && state.user.admin ? <AdminProductPost /> : <HomeGuest />} />
            <Route path="/admin-product-put/:id" element={state.loggedIn && state.user.admin ? <AdminProductPut /> : <HomeGuest />} />
            <Route path="/admin-product-image-post/:id" element={state.loggedIn && state.user.admin ? <AdminProductImagePost /> : <HomeGuest />} />
            <Route path="/admin-product-image-put-select/:id" element={state.loggedIn && state.user.admin ? <AdminProductImagePutSelect /> : <HomeGuest />} />
            <Route path="/admin-product-image-put/:id" element={state.loggedIn && state.user.admin ? <AdminProductImagePut /> : <HomeGuest />} />
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
