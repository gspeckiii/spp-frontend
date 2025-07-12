// app/context/GlobalStateProvider.js

import React, { useEffect } from "react";
import { useImmerReducer } from "use-immer";
import Axios from "axios";
import StateContext from "./StateContext.js";
import DispatchContext from "./DispatchContext.js";

const SERVER_URL = "https://shermanpeckproductions.com";
const API_URL = `${SERVER_URL}/api`;
const IMAGE_URL = `${SERVER_URL}/`;

Axios.defaults.baseURL = API_URL;
console.log("Axios API baseURL configured to:", Axios.defaults.baseURL);

export default function GlobalStateProvider({ children }) {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("SPPtoken")),
    flashMessages: [],
    user: {
      token: localStorage.getItem("SPPtoken"),
      username: localStorage.getItem("SPPusername"),
      avatar: localStorage.getItem("SPPavatar"),
      bio: localStorage.getItem("SPPbio"),
      admin: Boolean(localStorage.getItem("SPPadmin")),
      user_id: parseInt(localStorage.getItem("SPPuser_id")) || null,
      refresh_interval:
        parseInt(localStorage.getItem("SPPrefreshInterval")) || 30 * 60 * 1000,
    },
    categories: {
      list: [],
      selectedCategory: null,
      loading: false,
      error: null,
    },
    products: [],
    urls: {
      server: SERVER_URL,
      api: API_URL,
      images: IMAGE_URL,
    },
  };

  function ourReducer(draft, action) {
    // ... all your reducer logic is correct and does not need to be changed ...
    switch (action.type) {
      case "logIn":
        draft.loggedIn = true;
        draft.user = {
          ...action.data,
          user_id: action.data.user_id,
          refresh_interval:
            action.data.refresh_interval || draft.user.refresh_interval,
        };
        return;
      case "logOut":
        draft.loggedIn = false;
        return;
      // ... all other cases ...
      case "setCategoryLoading":
        draft.categories.loading = true;
        return;
      case "setCategories":
        draft.categories.list = Array.from(
          new Map(
            action.data.map((cat) => [
              cat.cat_id,
              { ...cat, prod_count: parseInt(cat.prod_count) || 0 },
            ])
          ).values()
        );
        draft.categories.loading = false;
        draft.categories.error = null;
        return;
      case "setCategoryError":
        draft.categories.error = action.data;
        draft.categories.loading = false;
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  // This function can be passed via context if needed, but for now it's not part of the value.
  const updateRefreshInterval = async (newInterval) => {
    // ... logic is correct
  };

  // This useEffect for localStorage is correct
  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("SPPtoken", state.user.token);
      // ... etc.
    } else {
      localStorage.removeItem("SPPtoken");
      // ... etc.
    }
  }, [state.loggedIn, state.user.token]);

  // === THE DEFINITIVE FIX: Fetch categories on initial app load, regardless of login status ===
  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    async function fetchCategories() {
      try {
        dispatch({ type: "setCategoryLoading" });
        // The /categories endpoint is public, so no auth token is needed.
        const response = await Axios.get("/categories", {
          cancelToken: ourRequest.token,
        });
        dispatch({ type: "setCategories", data: response.data });
      } catch (e) {
        console.error("Fetch public categories error:", e);
        dispatch({
          type: "setCategoryError",
          data: "Could not fetch category data.",
        });
      }
    }
    fetchCategories(); // Run this immediately when the provider mounts

    return () => ourRequest.cancel();
  }, []); // The empty dependency array [] means this runs only ONCE.

  // This useEffect for refreshing the token is correct
  useEffect(() => {
    let refreshIntervalId;
    if (state.loggedIn) {
      // ... logic is correct
    }
    return () => clearInterval(refreshIntervalId);
  }, [state.loggedIn, state.user.refresh_interval]);

  return (
    // Pass the whole state object, which now includes the 'urls'
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}
