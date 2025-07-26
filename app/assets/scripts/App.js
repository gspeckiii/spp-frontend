// app/assets/scripts/App.js (Corrected and Final)

import React, { Component, useContext } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "lazysizes";

import "swiper/css";
import "swiper/css/navigation";
import "../styles/styles.css";

// Corrected import paths
import GlobalStateProvider from "../../context/GlobalStateProvider.js";
import AppRoutes from "../../components/AppRoutes.js";
import StateContext from "../../context/StateContext.js";

// Import the shell components
import Header from "../../components/Header.js";
import Footer from "../../components/Footer.js";
import FlashMessages from "../../components/FlashMessages.js";

// Your ErrorBoundary can remain unchanged
class ErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please try again later.</h1>;
    }
    return this.props.children;
  }
}

// A small wrapper component to get flash messages from context,
// as it needs to be a child of the provider.
function FlashMessagesWrapper() {
  const { flashMessages } = useContext(StateContext);
  return <FlashMessages messages={flashMessages} />;
}

function Main() {
  return (
    <ErrorBoundary>
      <GlobalStateProvider>
        <BrowserRouter>
          <FlashMessagesWrapper />
          <Header />
          {/* 
            The AppRoutes component will now handle the main content area,
            including its own loading state. The Header and Footer are
            now stable and will not be unmounted.
          */}
          <AppRoutes />
          <Footer />
        </BrowserRouter>
      </GlobalStateProvider>
    </ErrorBoundary>
  );
}

const root = ReactDOM.createRoot(document.querySelector("#app"));
root.render(<Main />);
