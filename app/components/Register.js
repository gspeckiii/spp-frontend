// Register.js (Final version with HTML restored)
import { useNavigate } from "react-router-dom";
import React, { useEffect, useContext } from "react";
import { useImmerReducer } from "use-immer";
import DispatchContext from "../context/DispatchContext";
import FlashMessages from "./FlashMessages";

import {
  checkUsernameAvailability,
  checkEmailAvailability,
  createUser,
} from "../services/api";

function Register() {
  const appDispatch = useContext(DispatchContext);
  const navigate = useNavigate();
  const initialState = {
    username: {
      value: "",
      hasErrors: false,
      message: "",
      isUnique: false,
      checkCount: 0,
    },
    email: {
      value: "",
      hasErrors: false,
      message: "",
      isUnique: false,
      checkCount: 0,
    },
    password: { value: "", hasErrors: false, message: "" },
    submitCount: 0,
  };

  // This reducer logic is correct.
  function ourReducer(draft, action) {
    switch (action.type) {
      case "usernameImmediately":
        draft.username.value = action.value;
        if (draft.username.value.length > 30) {
          draft.username.hasErrors = true;
          draft.username.message = "Username cannot exceed 30 characters.";
          return;
        }
        if (
          draft.username.value &&
          !/^[a-zA-Z0-9]+$/.test(draft.username.value)
        ) {
          draft.username.hasErrors = true;
          draft.username.message =
            "Username can only contain letters and numbers.";
          return;
        }
        draft.username.hasErrors = false;
        return;

      case "usernameAfterDelay":
        if (action.value.length < 3) {
          draft.username.hasErrors = true;
          draft.username.message = "Username must be at least 3 characters.";
        }
        if (!draft.username.hasErrors && !action.noRequest) {
          draft.username.checkCount++;
        }
        return;

      case "usernameUniqueResults":
        if (action.value) {
          draft.username.hasErrors = true;
          draft.username.isUnique = false;
          draft.username.message = "That username is already taken.";
        } else {
          draft.username.isUnique = true;
        }
        return;

      case "emailImmediately":
        draft.email.value = action.value;
        draft.email.hasErrors = false;
        return;

      case "emailAfterDelay":
        if (!/^\S+@\S+$/.test(action.value)) {
          draft.email.hasErrors = true;
          draft.email.message = "You must provide a valid email address.";
        }
        if (!draft.email.hasErrors && !action.noRequest) {
          draft.email.checkCount++;
        }
        return;

      case "emailUniqueResults":
        if (action.value) {
          draft.email.hasErrors = true;
          draft.email.isUnique = false;
          draft.email.message = "That email is already being used.";
        } else {
          draft.email.isUnique = true;
        }
        return;

      case "passwordImmediately":
        draft.password.value = action.value;
        if (draft.password.value.length > 50) {
          draft.password.hasErrors = true;
          draft.password.message = "Password cannot exceed 50 characters.";
          return;
        }
        draft.password.hasErrors = false;
        return;

      case "passwordAfterDelay":
        if (action.value.length < 12) {
          draft.password.hasErrors = true;
          draft.password.message = "Password must be at least 12 characters.";
        }
        return;

      case "submitForm":
        if (
          !draft.username.hasErrors &&
          draft.username.isUnique &&
          !draft.email.hasErrors &&
          draft.email.isUnique &&
          !draft.password.hasErrors
        ) {
          draft.submitCount++;
        }
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  // All useEffect hooks and the handleSubmit function are correct.
  useEffect(() => {
    if (state.username.value) {
      const delay = setTimeout(
        () =>
          dispatch({ type: "usernameAfterDelay", value: state.username.value }),
        800
      );
      return () => clearTimeout(delay);
    }
  }, [state.username.value]);

  useEffect(() => {
    if (state.email.value) {
      const delay = setTimeout(
        () => dispatch({ type: "emailAfterDelay", value: state.email.value }),
        800
      );
      return () => clearTimeout(delay);
    }
  }, [state.email.value]);

  useEffect(() => {
    if (state.password.value) {
      const delay = setTimeout(
        () =>
          dispatch({ type: "passwordAfterDelay", value: state.password.value }),
        800
      );
      return () => clearTimeout(delay);
    }
  }, [state.password.value]);

  useEffect(() => {
    if (state.username.checkCount) {
      let didCancel = false;
      const checkUsername = async () => {
        try {
          const response = await checkUsernameAvailability(
            state.username.value
          );
          if (!didCancel) {
            dispatch({ type: "usernameUniqueResults", value: response.data });
          }
        } catch (e) {
          if (!didCancel) {
            console.log("There was a problem checking the username.");
          }
        }
      };
      checkUsername();
      return () => (didCancel = true);
    }
  }, [state.username.checkCount]);

  useEffect(() => {
    if (state.email.checkCount) {
      let didCancel = false;
      const checkEmail = async () => {
        try {
          const response = await checkEmailAvailability(state.email.value);
          if (!didCancel) {
            dispatch({ type: "emailUniqueResults", value: response.data });
          }
        } catch (e) {
          if (!didCancel) {
            console.log("There was a problem checking the email.");
          }
        }
      };
      checkEmail();
      return () => (didCancel = true);
    }
  }, [state.email.checkCount]);

  useEffect(() => {
    if (state.submitCount) {
      let didCancel = false;
      const submitRegistration = async () => {
        try {
          const response = await createUser({
            username: state.username.value,
            email: state.email.value,
            password: state.password.value,
          });
          if (!didCancel) {
            appDispatch({ type: "logIn", data: response.data });
            appDispatch({
              type: "flashMessage",
              value: "Congrats! Welcome to your new account.",
            });

            // ================== 3. NAVIGATE on success ==================
            navigate("/home");
            // ==========================================================
          }
        } catch (e) {
          if (!didCancel) {
            appDispatch({
              type: "flashMessage",
              value: "Registration failed. Please try again.",
            });
          }
        }
      };
      submitRegistration();
      return () => (didCancel = true);
    }
  }, [state.submitCount, appDispatch, navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    dispatch({ type: "usernameImmediately", value: state.username.value });
    dispatch({
      type: "usernameAfterDelay",
      value: state.username.value,
      noRequest: true,
    });
    dispatch({ type: "emailImmediately", value: state.email.value });
    dispatch({
      type: "emailAfterDelay",
      value: state.email.value,
      noRequest: true,
    });
    dispatch({ type: "passwordImmediately", value: state.password.value });
    dispatch({ type: "passwordAfterDelay", value: state.password.value });
    dispatch({ type: "submitForm" });
  }

  const validationErrors = [];
  if (state.username.hasErrors) validationErrors.push(state.username.message);
  if (state.email.hasErrors) validationErrors.push(state.email.message);
  if (state.password.hasErrors) validationErrors.push(state.password.message);

  return (
    <div className="wrapper wrapper--wide">
      <FlashMessages messages={validationErrors} isValidationMessage={true} />

      {/* ======================= THIS HTML WAS MISSING ====================== */}
      <div className="form">
        <form onSubmit={handleSubmit}>
          <div className="form__group">
            <label htmlFor="username-register" className="form__label">
              <small>Username</small>
            </label>
            <input
              onChange={(e) =>
                dispatch({ type: "usernameImmediately", value: e.target.value })
              }
              id="username-register"
              name="username"
              className="form__input"
              type="text"
              placeholder="Pick a username"
              autoComplete="off"
            />
          </div>
          <div className="form__group">
            <label htmlFor="email-register" className="form__label">
              <small>Email</small>
            </label>
            <input
              onChange={(e) =>
                dispatch({ type: "emailImmediately", value: e.target.value })
              }
              id="email-register"
              name="email"
              className="form__input"
              type="text"
              placeholder="you@example.com"
              autoComplete="off"
            />
          </div>
          <div className="form__group">
            <label htmlFor="password-register" className="form__label">
              <small>Password</small>
            </label>
            <input
              onChange={(e) =>
                dispatch({ type: "passwordImmediately", value: e.target.value })
              }
              id="password-register"
              name="password"
              className="form__input"
              type="password"
              placeholder="Create a password"
            />
          </div>
          <button type="submit" className="form__button">
            Sign up
          </button>
        </form>
      </div>
      {/* ====================================================================== */}
    </div>
  );
}

export default Register;
