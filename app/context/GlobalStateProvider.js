// app/context/GlobalStateProvider.js

import React, { useEffect } from "react";
import { useImmerReducer } from "use-immer";
import Axios from "axios";
import StateContext from "./StateContext.js";
import DispatchContext from "./DispatchContext.js";

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
  };

  function ourReducer(draft, action) {
    switch (action.type) {
      case "logIn":
        draft.loggedIn = true;
        draft.user = {
          ...action.data,
          user_id: action.data.user_id,
          refresh_interval:
            action.data.refresh_interval || draft.user.refresh_interval,
        };
        console.log(
          "User logged in, user_id:",
          action.data.user_id,
          "username:",
          action.data.username
        );
        return;
      case "logOut":
        draft.loggedIn = false;
        return;
      case "flashMessage":
        draft.flashMessages.push(action.value);
        return;
      case "refreshToken":
        draft.user.token = action.data.token;
        draft.user.refresh_interval =
          action.data.refreshInterval || draft.user.refresh_interval;
        return;
      case "setRefreshInterval":
        draft.user.refresh_interval = action.data;
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
      case "selectCategory":
        draft.categories.selectedCategory = {
          ...action.data,
          prod_count: parseInt(action.data.prod_count) || 0,
        };
        return;
      case "deleteCategory":
        draft.categories.list = draft.categories.list.filter(
          (cat) => cat.cat_id !== action.data
        );
        if (draft.categories.selectedCategory?.cat_id === action.data) {
          draft.categories.selectedCategory = null;
        }
        return;
      case "updateCategory":
        const catIndex = draft.categories.list.findIndex(
          (cat) => cat.cat_id === action.data.cat_id
        );
        if (catIndex !== -1) {
          draft.categories.list[catIndex] = {
            ...action.data,
            prod_count: parseInt(action.data.prod_count) || 0,
          };
        } else {
          console.warn("Category not found for update:", action.data.cat_id);
        }
        if (draft.categories.selectedCategory?.cat_id === action.data.cat_id) {
          draft.categories.selectedCategory = {
            ...action.data,
            prod_count: parseInt(action.data.prod_count) || 0,
          };
        }
        return;
      case "addCategory":
        draft.categories.list.push({
          ...action.data,
          prod_count: parseInt(action.data.prod_count) || 0,
        });
        return;
      case "incrementProdCount":
        const prodIndex = draft.categories.list.findIndex(
          (cat) => cat.cat_id === action.data
        );
        if (prodIndex !== -1) {
          draft.categories.list[prodIndex].prod_count =
            parseInt(draft.categories.list[prodIndex].prod_count || 0) + 1;
        }
        if (draft.categories.selectedCategory?.cat_id === action.data) {
          draft.categories.selectedCategory.prod_count =
            parseInt(draft.categories.selectedCategory.prod_count || 0) + 1;
        }
        return;
      case "decrementProdCount":
        const decIndex = draft.categories.list.findIndex(
          (cat) => cat.cat_id === action.data
        );
        if (decIndex !== -1) {
          draft.categories.list[decIndex].prod_count = Math.max(
            parseInt(draft.categories.list[decIndex].prod_count || 0) - 1,
            0
          );
        }
        if (draft.categories.selectedCategory?.cat_id === action.data) {
          draft.categories.selectedCategory.prod_count = Math.max(
            parseInt(draft.categories.selectedCategory.prod_count || 0) - 1,
            0
          );
        }
        return;
      case "setProducts":
        draft.products = Array.from(
          new Map(action.data.map((prod) => [prod.id, prod])).values()
        );
        return;
      case "incrementImgCount":
        const imgIndex = draft.products.findIndex(
          (prod) => prod.id === action.data.productId
        );
        if (imgIndex !== -1) {
          draft.products[imgIndex].img_count =
            (parseInt(draft.products[imgIndex].img_count) || 0) +
            action.data.count;
        }
        return;
      case "setCategoryLoading":
        draft.categories.loading = true;
        return;
      case "setCategoryError":
        draft.categories.error = action.data;
        draft.categories.loading = false;
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  const updateRefreshInterval = async (newInterval) => {
    try {
      console.log(
        "updateRefreshInterval called with:",
        newInterval,
        "user_id:",
        state.user.user_id
      );
      if (!state.user.user_id) throw new Error("User ID not available");
      const token = localStorage.getItem("SPPtoken");
      if (!token) throw new Error("No token available");
      const response = await Axios.put(
        `/users/${state.user.user_id}/refresh-interval`,
        { refreshInterval: newInterval },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch({ type: "setRefreshInterval", data: newInterval });
      console.log("Refresh interval updated:", response.data);
      return response;
    } catch (error) {
      console.error(
        "Error updating refresh interval:",
        error.response ? error.response.data : error.message
      );
      if (error.response?.status === 401) {
        dispatch({
          type: "flashMessage",
          value: "Session expired. Please log in again.",
        });
        dispatch({ type: "logOut" });
      }
      throw error;
    }
  };

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("SPPtoken", state.user.token);
      localStorage.setItem("SPPusername", state.user.username);
      localStorage.setItem("SPPavatar", state.user.avatar);
      localStorage.setItem("SPPadmin", state.user.admin);
      localStorage.setItem("SPPbio", state.user.bio);
      localStorage.setItem("SPPuser_id", state.user.user_id?.toString());
      localStorage.setItem(
        "SPPrefreshInterval",
        state.user.refresh_interval.toString()
      );
    } else {
      localStorage.removeItem("SPPtoken");
      localStorage.removeItem("SPPusername");
      localStorage.removeItem("SPPavatar");
      localStorage.removeItem("SPPadmin");
      localStorage.removeItem("SPPbio");
      localStorage.removeItem("SPPuser_id");
      localStorage.removeItem("SPPrefreshInterval");
    }
  }, [state.loggedIn, state.user]);

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    async function fetchCategories() {
      try {
        dispatch({ type: "setCategoryLoading" });
        const token = localStorage.getItem("SPPtoken");
        const response = await Axios.get("/categories", {
          headers: { Authorization: `Bearer ${token}` },
          cancelToken: ourRequest.token,
        });
        dispatch({ type: "setCategories", data: response.data });
      } catch (e) {
        console.error(
          "Fetch categories error:",
          e.response ? e.response.data : e.message
        );
        dispatch({
          type: "setCategoryError",
          data: e.response
            ? e.response.data.error
            : "Error fetching categories",
        });
      }
    }
    if (state.user.token) {
      fetchCategories();
    }
    return () => ourRequest.cancel();
  }, [state.user.token]);

  useEffect(() => {
    let refreshIntervalId;
    if (state.loggedIn) {
      refreshIntervalId = setInterval(async () => {
        try {
          const token = localStorage.getItem("SPPtoken");
          const response = await Axios.post(
            "/refresh",
            { refreshInterval: state.user.refresh_interval },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          dispatch({ type: "refreshToken", data: response.data });
          if (response.data.refreshInterval) {
            dispatch({
              type: "setRefreshInterval",
              data: response.data.refreshInterval,
            });
          }
        } catch (error) {
          console.error(
            "Token refresh error:",
            error.response ? error.response.data : error.message
          );
          dispatch({
            type: "flashMessage",
            value: "Session expired. Please log in again.",
          });
          dispatch({ type: "logOut" });
        }
      }, state.user.refresh_interval);
    }
    return () => clearInterval(refreshIntervalId);
  }, [state.loggedIn, state.user.refresh_interval]);

  return (
    <StateContext.Provider value={{ ...state, updateRefreshInterval }}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}
