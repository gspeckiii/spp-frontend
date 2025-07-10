import React, { useContext, useState } from "react";
import Axios from "axios";
import StateContext from "../context/StateContext";
import DispatchContext from "../context/DispatchContext";

function Settings() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const [intervalMinutes, setIntervalMinutes] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      console.log("Settings component rendered, appState:", appState);
      if (!appState.user.user_id) {
        console.error("user_id not available in appState");
        appDispatch({
          type: "flashMessage",
          value: "Error: User ID not available",
        });
        return;
      }
      const newInterval = parseInt(intervalMinutes) * 60 * 1000;
      if (newInterval < 5 * 60 * 1000) {
        appDispatch({
          type: "flashMessage",
          value: "Refresh interval must be at least 5 minutes",
        });
        return;
      }
      console.log(
        "Updating refresh interval to:",
        newInterval,
        "for user_id:",
        appState.user.user_id
      );
      const response = await Axios.put(
        `/users/${appState.user.user_id}/refresh-interval`,
        { refreshInterval: newInterval },
        {
          headers: { Authorization: `Bearer ${appState.user.token}` },
        }
      );
      console.log("Refresh interval response:", response.data);
      if (response.status >= 200 && response.status < 300) {
        appDispatch({ type: "setRefreshInterval", data: newInterval });
        appDispatch({
          type: "flashMessage",
          value: `Refresh interval updated to ${newInterval / 60000} minutes`,
        });
        setIntervalMinutes("");
      } else {
        throw new Error(
          response.data?.error || "Failed to update refresh interval"
        );
      }
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
          "Failed to update refresh interval",
      });
    }
  }

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit} className="form">
        <h2>Update Refresh Interval</h2>
        <label className="form__label">
          Refresh Interval (minutes):
          <input
            type="number"
            min="5"
            value={intervalMinutes}
            onChange={(e) => setIntervalMinutes(e.target.value)}
            className="form__input"
            placeholder="Enter minutes (minimum 5)"
          />
        </label>
        <button type="submit" className="form__button">
          Update Interval
        </button>
      </form>
    </div>
  );
}

export default Settings;
