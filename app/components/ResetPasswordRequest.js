// app/components/ResetPasswordRequest.js (Refactored)

import React, { useState } from "react";
import Page from "./Page.js";
import { useNavigate } from "react-router-dom";
// Import the new API function
import { requestPasswordReset } from "../services/api";

function ResetPasswordRequest() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      // Use the new, clean API function
      await requestPasswordReset(email);
      setMessage(
        "Password reset email has been sent. Please check your inbox."
      );
      // We don't automatically redirect here, as the user needs to go to their email client.
    } catch (e) {
      console.error("Error requesting password reset:", e);
      setMessage(
        e.response
          ? e.response.data.error
          : "Error making the request. Please try again."
      );
    }
  }

  return (
    <Page title="Request Password Reset">
      {/* Use the .form class for consistent styling */}
      <form onSubmit={handleSubmit} className="form">
        <h2 className="form__heading">Reset Your Password</h2>
        <p
          className="form__helper-text"
          style={{ textAlign: "center", marginBottom: "1.5rem" }}
        >
          Enter your email address and we will send you a link to reset your
          password.
        </p>

        <div className="form__group">
          <label htmlFor="email-reset" className="form__label">
            Email Address
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email-reset"
            name="email"
            className="form__input"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </div>

        <button type="submit" className="form__button">
          Send Reset Link
        </button>

        {/* Use the new helper classes for messages */}
        {message && <p className="form__success-message">{message}</p>}
      </form>
    </Page>
  );
}

export default ResetPasswordRequest;
