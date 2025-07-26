import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import DispatchContext from "../context/DispatchContext";
import { login } from "../services/api";

function HeaderLoggedOut({ closeModal }) {
  const appDispatch = useContext(DispatchContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await login({ username, password });
      if (response.data.token) {
        appDispatch({ type: "logIn", data: response.data });
        appDispatch({
          type: "flashMessage",
          value: "You have successfully logged in!",
        });
        navigate("/");
        // Close the modal only if the function is provided
        if (closeModal) closeModal();
      } else {
        appDispatch({
          type: "flashMessage",
          value: "Incorrect username or password.",
        });
      }
    } catch (e) {
      appDispatch({
        type: "flashMessage",
        value: e.response?.data?.error || "Login failed. Please try again.",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form__group">
        <input
          onChange={(e) => setUsername(e.target.value)}
          name="username"
          className="form__input"
          type="text"
          placeholder="Username"
          autoComplete="username"
        />
      </div>
      <div className="form__group">
        <input
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          className="form__input"
          type="password"
          placeholder="Password"
          autoComplete="current-password"
        />
      </div>

      <button type="submit" className="form__button">
        Sign In
      </button>
    </form>
  );
}

export default HeaderLoggedOut;
