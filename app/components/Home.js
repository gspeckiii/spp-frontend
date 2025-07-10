import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Page from "./Page";
import StateContext from "../context/StateContext.js";
import CategorySlider from "./CategorySlider";
function Home(props) {
  const appState = useContext(StateContext);

  return (
    <Page title="Home">
      <div className="page-content">
        <CategorySlider />
      </div>
    </Page>
  );
}

export default Home;
