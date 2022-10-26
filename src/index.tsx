import React from 'react';
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './index.css';
import { AddCredentials } from './AddCredentials';
import { TinkLinkCallback } from './TinkLinkCallback';

const rootElement = document.getElementById("root") as HTMLElement;
const root = createRoot(rootElement );

root.render(
  <Router>
    <Routes>
      <Route path="/callback" element={<TinkLinkCallback />} />
      <Route path="/" element={<AddCredentials />}>
      </Route>
    </Routes>
  </Router>
);
