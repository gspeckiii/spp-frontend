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
    // This state now acts as a signal for other components
    appIsReady: false,
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
    historicProducts: {
      list: [],
      loading: true,
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
      case "setAppIsReady":
        draft.appIsReady = true;
        return;

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
        localStorage.removeItem("SPPtoken");
        localStorage.removeItem("SPPusername");
        localStorage.removeItem("SPPavatar");
        localStorage.removeItem("SPPbio");
        localStorage.removeItem("SPPadmin");
        localStorage.removeItem("SPPuser_id");
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

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("SPPtoken", state.user.token);
      localStorage.setItem("SPPusername", state.user.username);
      localStorage.setItem("SPPavatar", state.user.avatar);
      localStorage.setItem("SPPbio", state.user.bio);
      localStorage.setItem("SPPadmin", state.user.admin);
      localStorage.setItem("SPPuser_id", state.user.user_id);
    }
  }, [state.loggedIn]);

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();

    async function fetchInitialData() {
      try {
        const [catResponse, historicResponse] = await Promise.all([
          Axios.get("/categories", { cancelToken: ourRequest.token }),
          Axios.get("/products/historic", { cancelToken: ourRequest.token }),
        ]);

        dispatch({ type: "setCategories", data: catResponse.data });
        dispatch({ type: "setHistoricProducts", data: historicResponse.data });
      } catch (e) {
        if (!Axios.isCancel(e)) {
          console.error("Error fetching initial app data:", e);
        }
      }
      // After all data fetching is attempted, mark the app as ready to render
      dispatch({ type: "setAppIsReady" });
    }

    fetchInitialData();

    return () => ourRequest.cancel();
  }, []); // Runs ONCE on app load

  // The provider now ALWAYS renders its children, preventing the DOM error.
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}
