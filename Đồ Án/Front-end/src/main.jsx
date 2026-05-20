
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import Toast from "./components/Toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ToastProvider>
      <CartProvider>
        <App />
        <Toast />
      </CartProvider>
    </ToastProvider>
  </React.StrictMode>
);
