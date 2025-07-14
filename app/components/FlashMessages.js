// FlashMessages.js (Updated)
import React, { useEffect } from "react";

function FlashMessages(props) {
  // useEffect will run whenever the 'props.messages' array changes.
  useEffect(() => {
    // ONLY run the timer for global messages (when props.dispatch exists and it's not a validation message)
    if (props.dispatch && !props.isValidationMessage) {
      if (props.messages.length > 0) {
        const timer = setTimeout(() => {
          props.dispatch({ type: "clearFlashMessages" });
        }, 3000); // 3 seconds

        return () => clearTimeout(timer);
      }
    }
  }, [props.messages, props.dispatch, props.isValidationMessage]);

  // If there are no messages, don't render anything.
  if (props.messages.length === 0) {
    return null;
  }

  return (
    <div className="flash-messages">
      <div className="flash-messages__alert-container">
        {props.messages.map((msg, index) => {
          // Use a different class for validation errors for different styling if needed
          const alertClass = props.isValidationMessage
            ? "flash-messages__alert--danger" // Red for errors
            : "flash-messages__alert--success"; // Green for success

          return (
            <div
              key={index}
              className={`flash-messages__alert ${alertClass} flash-messages__alert--floating`}
            >
              {msg}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FlashMessages;
