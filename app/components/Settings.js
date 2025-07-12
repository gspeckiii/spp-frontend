// app/components/Settings.js (Refactored)

import React, { useState, useContext } from "react";
import Page from "./Page.js";
import StateContext from "../context/StateContext";
import DispatchContext from "../context/DispatchContext";
// Import the new API function
import { setRefreshInterval } from "../services/api";

function Settings() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const [intervalMinutes, setIntervalMinutes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!appState.user.user_id) {
        throw new Error("User ID not available. Please log in again.");
      }

      const newIntervalMs = parseInt(intervalMinutes) * 60 * 1000;

      if (isNaN(newIntervalMs) || newIntervalMs < 5 * 60 * 1000) {
        appDispatch({
          type: "flashMessage",
          value: "Refresh interval must be a number and at least 5 minutes.",
        });
        setIsSubmitting(false);
        return;
      }

      // Use the new, clean API function
      await setRefreshInterval(appState.user.user_id, newIntervalMs);

      // Update global state and show success message
      appDispatch({ type: "setRefreshInterval", data: newIntervalMs });
      appDispatch({
        type: "flashMessage",
        value: `Refresh interval updated to ${intervalMinutes} minutes.`,
      });

      // Clear the form
      setIntervalMinutes("");
    } catch (e) {
      console.error(
        "Update refresh interval error:",
        e.response ? e.response.data : e.message
      );
      appDispatch({
        type: "flashMessage",
        value:
          e.response?.data?.error ||
          e.message ||
          "Failed to update refresh interval.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Page title="Settings">
      <form onSubmit={handleSubmit} className="form">
        <h2 className="form__heading">Token Refresh Settings</h2>

        <div className="form__group">
          <label htmlFor="interval-minutes" className="form__label">
            Refresh Interval (minutes)
          </label>
          <input
            id="interval-minutes"
            type="number"
            min="5"
            value={intervalMinutes}
            onChange={(e) => setIntervalMinutes(e.target.value)}
            className="form__input"
            placeholder={`Current: ${
              appState.user.refresh_interval / 60000
            } min (minimum 5)`}
            required
          />
        </div>

        <button type="submit" className="form__button" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Interval"}
        </button>
      </form>
    </Page>
  );
}

export default Settings;
