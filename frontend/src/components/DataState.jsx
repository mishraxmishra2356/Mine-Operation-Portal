import React from "react";

// Shows a loading or error message; renders children once data is ready.
function DataState({ loading, error, children }) {
  if (loading) return <p className="panel-note">Loading…</p>;
  if (error) return <p className="panel-note tone-bad" role="alert">{error}</p>;
  return children;
}

export default DataState;
