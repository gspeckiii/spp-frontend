// app/assets/scripts/App.js (Refactored)

import React, { Component } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "lazysizes";
import "../styles/styles.css";

// === THE DEFINITIVE FIX: Corrected import paths ===
// The path from /assets/scripts/ needs to go up two levels to the /app/ directory
import GlobalStateProvider from "../../context/GlobalStateProvider.js";
import AppRoutes from "../../components/AppRoutes.js";
import StateContext from "../../context/StateContext.js"; // This is also needed for the wrapper

// Import the shell components
import Header from "../../components/Header.js";
import Footer from "../../components/Footer.js";
import FlashMessages from "../../components/FlashMessages.js";

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

function Main() {
  return (
    <ErrorBoundary>
      <GlobalStateProvider>
        <BrowserRouter>
          <FlashMessagesWrapper />
          <Header />
          <main className="page-content">
            <AppRoutes />
          </main>
          <Footer />
        </BrowserRouter>
      </GlobalStateProvider>
    </ErrorBoundary>
  );
}

// A small wrapper component to get flash messages from context
function FlashMessagesWrapper() {
  const { flashMessages } = React.useContext(StateContext);
  return <FlashMessages messages={flashMessages} />;
}

const root = ReactDOM.createRoot(document.querySelector("#app"));
root.render(<Main />);
