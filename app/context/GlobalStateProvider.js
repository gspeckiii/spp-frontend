import React, { useEffect } from "react";
import { useImmerReducer } from "use-immer";
import Axios from "axios";
import StateContext from "./StateContext.js";
import DispatchContext from "./DispatchContext.js";
import { SERVER_URL, API_URL, IMAGE_URL } from "../config.js";

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
    // === NEW STATE SLICE ADDED HERE ===
    historicProducts: {
      list: [],
      loading: true, // Start in loading state
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
    switch (action.type) {
      // ... (your other cases like flashMessage, logIn, etc.)
      case "flashMessage":
        draft.flashMessages.push(action.value);
        return;
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

      // === NEW REDUCER CASES FOR HISTORIC PRODUCTS ===
      case "setHistoricProductsLoading":
        draft.historicProducts.loading = true;
        return;
      case "setHistoricProducts":
        draft.historicProducts.list = action.data;
        draft.historicProducts.loading = false;
        draft.historicProducts.error = null;
        return;
      case "setHistoricProductsError":
        draft.historicProducts.error = action.data;
        draft.historicProducts.loading = false;
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  // ... (useEffect for localStorage and token refresh remain the same) ...

  // Fetch initial data (Categories and Historic Products)
  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();

    async function fetchInitialData() {
      // Fetch Categories (existing logic)
      try {
        dispatch({ type: "setCategoryLoading" });
        const catResponse = await Axios.get("/categories", {
          cancelToken: ourRequest.token,
        });
        dispatch({ type: "setCategories", data: catResponse.data });
      } catch (e) {
        if (!Axios.isCancel(e)) {
          console.error("Fetch categories error:", e);
          dispatch({
            type: "setCategoryError",
            data: "Could not fetch category data.",
          });
        }
      }

      // === NEW LOGIC: Fetch Historic Products ===
      try {
        dispatch({ type: "setHistoricProductsLoading" });
        const historicResponse = await Axios.get("/products/historic", {
          cancelToken: ourRequest.token,
        });
        dispatch({ type: "setHistoricProducts", data: historicResponse.data });
      } catch (e) {
        if (!Axios.isCancel(e)) {
          console.error("Fetch historic products error:", e);
          dispatch({
            type: "setHistoricProductsError",
            data: "Could not fetch historic items.",
          });
        }
      }
    }

    fetchInitialData();

    return () => ourRequest.cancel();
  }, []); // Runs ONCE on app load

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}
