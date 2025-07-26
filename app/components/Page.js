// Page.js (THE FINAL, CORRECTED ARCHITECTURE)

import React, { useEffect } from "react";
import Container from "./Container";

function Page(props) {
  useEffect(() => {
    document.title = `${props.title} | SPP`;
    window.scrollTo(0, 0);
  }, [props.title]);

  // Determine the correct container class based on the layout prop.
  let containerClass = "container--narrow"; // The default
  if (props.layout === "wide") {
    containerClass = "container--wide";
  } else if (props.layout === "two-column") {
    containerClass = "container--two-column";
  }

  // The Container component is now simpler. It just receives the final class.
  // We also pass the transparent prop if it exists.
  return (
    <Container className={containerClass} transparent={props.transparent}>
      {props.children}
    </Container>
  );
}

export default Page;
