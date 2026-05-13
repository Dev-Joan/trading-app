// DownloadButtons.js

import React from 'react';
import { FaApple, FaGooglePlay } from 'react-icons/fa';

const DownloadButtons = () => {
  return (
    <div className="download-buttons">
      <a href="#" className="download-button">
        <FaApple /> Download on the App Store
      </a>
      <a href="#" className="download-button">
        <FaGooglePlay /> Get it on Google Play
      </a>
    </div>
  );
};

export default DownloadButtons;
