// app/components/ResetPassword.js (Refactored)

import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Page from "./Page.js";
// Import the new API function
import { resetPassword } from "../services/api";

function ResetPassword() {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // This effect correctly pre-fills the token from the URL
    const urlToken = searchParams.get("token");
    if (urlToken) {
      setToken(urlToken);
    }
  }, [searchParams]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!token || !newPassword) {
      setMessage("Token and new password are required.");
      return;
    }
    try {
      // Use the new, clean API function
      const response = await resetPassword(token, newPassword);
      setMessage(response.data.message);

      // Redirect to home page after a brief delay for the user to see the success message
      setTimeout(() => navigate("/"), 2000);
    } catch (e) {
      console.error("Error resetting password:", e);
      setMessage(
        e.response ? e.response.data.error : "Error resetting password"
      );
    }
  }

  return (
    <Page title="Reset Password">
      {/* Use the .form class for consistent styling */}
      <form onSubmit={handleSubmit} className="form">
        <h2 className="form__heading">Reset Your Password</h2>
        <p
          className="form__helper-text"
          style={{ textAlign: "center", marginBottom: "1.5rem" }}
        >
          Please enter your new password below.
        </p>

        <div className="form__group">
          <label htmlFor="token-field" className="form__label">
            Reset Token{" "}
            <span className="form__helper-text--info">(From Email)</span>
          </label>
          <input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            id="token-field"
            className="form__input"
            type="text"
            placeholder="Paste token here"
          />
        </div>

        <div className="form__group">
          <label htmlFor="new-password" className="form__label">
            New Password
          </label>
          <input
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            id="new-password"
            className="form__input"
            type="password"
            placeholder="Enter new password"
            required
          />
        </div>

        <button type="submit" className="form__button">
          Reset Password
        </button>

        {message && <p className="form__success-message">{message}</p>}
      </form>
    </Page>
  );
}

export default ResetPassword;
