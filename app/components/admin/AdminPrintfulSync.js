// === NEW FILE ===
import React, { useState, useContext } from "react";
import Page from "../Page";
import DispatchContext from "../../context/DispatchContext";
import { syncPrintfulProducts } from "../../services/api";

function AdminPrintfulSync() {
  const appDispatch = useContext(DispatchContext);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSync = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await syncPrintfulProducts();
      setResult({ success: true, message: response.data.message });
      appDispatch({
        type: "flashMessage",
        value: "Printful sync completed successfully!",
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "An unknown error occurred.";
      setResult({ success: false, message: errorMessage });
      appDispatch({
        type: "flashMessage",
        value: `Error during sync: ${errorMessage}`,
      });
      console.error("Printful sync failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Page title="Sync Printful Products">
      <div className="form" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h2 className="form__heading">Printful Product Synchronization</h2>
        <p style={{ textAlign: "center", marginBottom: "2rem" }}>
          Click the button below to fetch all products from your Printful store
          and add them to this website's database. This will overwrite existing
          Printful products with the latest data but will not affect your
          non-Printful items.
        </p>
        <div style={{ textAlign: "center" }}>
          <button
            onClick={handleSync}
            className="form__button"
            disabled={isLoading}
          >
            {isLoading ? "Syncing..." : "Sync Products Now"}
          </button>
        </div>
        {result && (
          <div
            className="text-center"
            style={{
              marginTop: "2rem",
              padding: "1rem",
              borderRadius: "5px",
              backgroundColor: result.success
                ? "rgba(40, 167, 69, 0.2)"
                : "rgba(220, 53, 69, 0.2)",
              border: `1px solid ${result.success ? "#28a745" : "#dc3545"}`,
            }}
          >
            <p
              style={{
                margin: 0,
                color: result.success ? "#28a745" : "#dc3545",
              }}
            >
              <strong>{result.success ? "Success!" : "Error:"}</strong>{" "}
              {result.message}
            </p>
          </div>
        )}
      </div>
    </Page>
  );
}

export default AdminPrintfulSync;
