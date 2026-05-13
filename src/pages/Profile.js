// Profile.js

import React from 'react';
import stockInfo from '../server/StockInfo';

const Profile = () => {

	const handleClick = () => {
		stockInfo.printWorking();
	};

  return (
    <div style={{
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      textAlign: 'center'
    }}>
      <h1>Profile Page</h1>
		  <p>Welcome to the Profile section of our stock trading app!</p>
		  <button onClick={handleClick}>Test Stock Info</button>
    </div>
  );
};

export default Profile;