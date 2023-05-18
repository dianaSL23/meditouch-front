import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from "react-redux";
import { createStore } from "redux";
import reducer from "./public/store";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import i18next from "./i18n"
import { I18nextProvider } from "react-i18next";

const store = createStore(reducer);

ReactDOM.render(
  <Provider store={store}>
    <I18nextProvider i18n={i18next}>
      <Suspense fallback="Loading...">
        <App />
      </Suspense>
    </I18nextProvider>
  </Provider>,
  document.getElementById("root")
);
