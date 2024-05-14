// src/app/layout.js

import React from 'react';
import './globals.css';  

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="page-container">
      <img
        src="/eigenlayer_logo.png"
        alt="EigenLayer Logo"
        className="logo"
        id="eigenlayer-logo"
      />
      <img
        src="/dune-icon-only.svg"
        alt="Dune Logo"
        className="logo"
        id="dune-logo"
      />
      {children}
    </div>
  );
};

export default Layout;
