// src/app/layout.tsx

import React from 'react';
import Image from 'next/image';
import './globals.css';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="page-container">
      <div className="logo-container">
        <Image
          src="/eigenlayer_logo.png"
          alt="EigenLayer Logo"
          width={80} // Adjust width as needed
          height={80} // Adjust height as needed
          className="logo"
          id="eigenlayer-logo"
        />
        <Image
          src="/dune-icon-only.svg"
          alt="Dune Logo"
          width={80} // Adjust width as needed
          height={80} // Adjust height as needed
          className="logo"
          id="dune-logo"
        />
      </div>
      {children}
    </div>
  );
};

export default Layout;
