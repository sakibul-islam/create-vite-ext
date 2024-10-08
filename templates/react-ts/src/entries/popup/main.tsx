import React from "react";
import ReactDOM from "react-dom/client";
import Popup from "./Popup.tsx";
import "@/styles/global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
);
