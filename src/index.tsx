import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./index.css";
import { AddCredentials } from "./AddCredentials";
import { TinkLinkCallback } from "./TinkLinkCallback";
import { ConnectBankAccount } from "./ConnectBankAccount";

ReactDOM.render(
  <Router>
    <Switch>
      <Route path="/callback">
        <TinkLinkCallback />
      </Route>
      <Route path="/connect-bank-account">
        <ConnectBankAccount />
      </Route>
      <Route path="/">
        <AddCredentials />
      </Route>
    </Switch>
  </Router>,
  document.getElementById("root")
);
