//Header.js

import React from 'react';
import DownloadButtons from './DownloadButtons';

const Header = () => {
  return (
    <div className="header-container">
      <h1>Get your trading superpowers</h1>
      <p>You don't have to be a pro to experience game-changing investment tools</p>
      <DownloadButtons />
    </div>
  );
};

export default Header;
