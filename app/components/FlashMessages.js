// FlashMessages.js
import React, { useEffect } from "react"
// Don't forget to import your CSS file

function FlashMessages(props) {
  return (
    // The main block container
    <div className="flash-messages">
      {/* This container helps with the :last-of-type selector in CSS.
          You might choose to conditionally render or use a different approach
          depending on your exact animation/display needs. */}
      <div className="flash-messages__alert-container">
        {props.messages.map((msg, index) => {
          return (
            <div
              key={index}
              className="flash-messages__alert
                         flash-messages__alert--success
                         flash-messages__alert--floating"
            >
              {msg}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FlashMessages
