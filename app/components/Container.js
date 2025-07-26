import React from "react";

// No CSS import here, as it's handled globally by your build process.

function Container(props) {
  // Build the className string.
  // Example for wide page: "container container--wide"
  // Example for two-column page: "container container--narrow container--two-column"
  const classNames = `
    container
    ${props.wide ? "container--wide" : "container--narrow"}
    ${props.className || ""}
  `
    .trim()
    .replace(/\s+/g, " "); // Clean up whitespace

  return <div className={classNames}>{props.children}</div>;
}

export default Container;
