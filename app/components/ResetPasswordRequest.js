// app/components/ResetPasswordRequest.js (FINAL, SYNTAX CORRECTED)

import React, { useState, useContext } from "react";
import Page from "./Page.js";
import { useNavigate } from "react-router-dom";
import DispatchContext from "../context/DispatchContext";
import { requestPasswordReset } from "../services/api";

function ResetPasswordRequest() {
  const appDispatch = useContext(DispatchContext);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await requestPasswordReset(email);

      appDispatch({
        type: "flashMessage",
        value: "Password reset token sent. Please check your email inbox.",
      });

      navigate("/reset-password");
    } catch (e) {
      console.error("Error requesting password reset:", e);
      appDispatch({
        type: "flashMessage",
        value: e.response
          ? e.response.data.error
          : "Error making the request. Please try again.",
      });
    }
  }

  return (
    <Page title="Request Password Reset">
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
      </form>
    </Page>
  );
}

export default ResetPasswordRequest;
