// app/components/AppRoutes.js (Completed with Loading Gate)

import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import StateContext from "../context/StateContext.js";

// Import ALL components used in your routes
import Home from "./Home.js";
import HomeGuest from "./HomeGuest.js";
import AboutArtist from "./AboutArtist.js";
import AboutEngineer from "./AboutEngineer.js";
import AboutHistory from "./AboutHistory.js";
import AboutFamily from "./AboutFamily.js";
import AboutRaven from "./AboutRaven.js";
import Terms from "./Terms.js";
import RequestPasswordReset from "./ResetPasswordRequest";
import ResetPassword from "./ResetPassword";
import Register from "./Register";
import AdminDashboard from "./admin/AdminDashboard.js";
import AdminCategoryPost from "./admin/AdminCategoryPost.js";
import AdminCategoryPutSelect from "./admin/AdminCategoryPutSelect.js";
import AdminCategoryPut from "./admin/AdminCategoryPut.js";
import AdminProductPutSelect from "./admin/AdminProductPutSelect.js";
import AdminProductPost from "./admin/AdminProductPost.js";
import AdminProductPut from "./admin/AdminProductPut.js";
import AdminProductImagePost from "./admin/AdminProductImagePost.js";
import AdminProductImagePut from "./admin/AdminProductImagePut.js";
import AdminProductImagePutSelect from "./admin/AdminProductImagePutSelect.js";
import AdminCategoryImagePost from "./admin/AdminCategoryImagePost";
import ProductSlider from "./ProductSlider";
import OrderForm from "./OrderForm";
import PaymentForm from "./PaymentForm.js";
import Settings from "./Settings.js";
import AdminOrder from "./admin/AdminOrder.js";
import LoadingDotsIcon from "./LoadingDotsIcon.js";

export default function AppRoutes() {
  const appState = useContext(StateContext);

  // If the app's initial data is not yet loaded, show a full-page loading spinner.
  if (!appState.appIsReady) {
    return (
      <main
        className="page-content"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LoadingDotsIcon />
      </main>
    );
  }

  // Once the app is ready, render the main content container with all the routes.
  return (
    <main className="page-content">
      <Routes>
        {/* === All of your existing routes go here === */}
        <Route
          path="/"
          element={appState.loggedIn ? <Home /> : <HomeGuest />}
        />
        <Route
          path="/request-password-reset"
          element={<RequestPasswordReset />}
        />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin-dashboard"
          element={
            appState.loggedIn && appState.user.admin ? (
              <AdminDashboard />
            ) : (
              <HomeGuest />
            )
          }
        />
        <Route
          path="/admin-category-post"
          element={
            appState.loggedIn && appState.user.admin ? (
              <AdminCategoryPost />
            ) : (
              <HomeGuest />
            )
          }
        />
        <Route
          path="/admin-category-put-select"
          element={
            appState.loggedIn && appState.user.admin ? (
              <AdminCategoryPutSelect />
            ) : (
              <HomeGuest />
            )
          }
        />
        <Route
          path="/admin-category-put/:id"
          element={
            appState.loggedIn && appState.user.admin ? (
              <AdminCategoryPut />
            ) : (
              <HomeGuest />
            )
          }
        />
        <Route
          path="/admin-category-image-post/:id"
          element={
            appState.loggedIn && appState.user.admin ? (
              <AdminCategoryImagePost />
            ) : (
              <HomeGuest />
            )
          }
        />
        <Route
          path="/admin-product-put-select/:id"
          element={
            appState.loggedIn && appState.user.admin ? (
              <AdminProductPutSelect />
            ) : (
              <HomeGuest />
            )
          }
        />
        <Route
          path="/admin-product-post/:id"
          element={
            appState.loggedIn && appState.user.admin ? (
              <AdminProductPost />
            ) : (
              <HomeGuest />
            )
          }
        />
        <Route path="/admin-product-put/:id" element={<AdminProductPut />} />
        <Route
          path="/admin-product-image-post/:id"
          element={
            appState.loggedIn && appState.user.admin ? (
              <AdminProductImagePost />
            ) : (
              <HomeGuest />
            )
          }
        />
        <Route
          path="/admin-product-image-put-select/:id"
          element={
            appState.loggedIn && appState.user.admin ? (
              <AdminProductImagePutSelect />
            ) : (
              <HomeGuest />
            )
          }
        />
        <Route
          path="/admin-product-image-put/:id"
          element={
            appState.loggedIn && appState.user.admin ? (
              <AdminProductImagePut />
            ) : (
              <HomeGuest />
            )
          }
        />
        <Route path="/settings" element={<Settings />} />
        <Route path="/category/:id/products" element={<ProductSlider />} />
        <Route
          path="/order/:productId"
          element={appState.loggedIn ? <OrderForm /> : <HomeGuest />}
        />
        <Route
          path="/admin/adminOrder"
          element={
            appState.loggedIn && appState.user.admin ? (
              <AdminOrder />
            ) : (
              <HomeGuest />
            )
          }
        />
        <Route
          path="/payment/:orderId"
          element={appState.loggedIn ? <PaymentForm /> : <HomeGuest />}
        />
        <Route path="/about-artist" element={<AboutArtist />} />
        <Route path="/about-engineer" element={<AboutEngineer />} />
        <Route path="/about-history" element={<AboutHistory />} />
        <Route path="/about-family" element={<AboutFamily />} />
        <Route path="/about-raven" element={<AboutRaven />} />
        <Route path="/terms" element={<Terms />} />
        <Route
          path="/home"
          element={appState.loggedIn ? <Home /> : <HomeGuest />}
        />
        <Route
          path="*"
          element={<h1 className="text-center">404 Page Not Found</h1>}
        />
      </Routes>
    </main>
  );
}
