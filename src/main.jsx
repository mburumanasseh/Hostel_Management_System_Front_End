import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./App.css";
import { startApiKeepAlive } from "./utils/keepAlive.js";

// Keep Render backend awake while this tab is open (every 30s)
startApiKeepAlive(30_000);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
