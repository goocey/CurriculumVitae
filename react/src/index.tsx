import * as React from "react";
import { render } from "react-dom";
import App from "./components/App";
import { BrowserRouter as Router, Route } from "react-router-dom";
import * as queryString from "query-string";

const rootEl = document.getElementById("root");

render(
  <Router>
    <Route
      render={(props) => <App qs={queryString.parse(props.location.search)} />}
    />
  </Router>,
  rootEl,
);
