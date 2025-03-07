"use client";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import { PersistGate } from "redux-persist/integration/react";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { store, persistor } from "@/store/store";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <body className="antialiased font-[Outfit]">
            {children}
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick={false}
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </body>
        </PersistGate>
      </Provider>
    </html>
  );
}
