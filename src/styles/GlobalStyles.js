//GlobalStyles.js

import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
  }

  body {
    background: linear-gradient(135deg, #1e2a47, #312055);
    color: #ffffff;
    min-height: 100vh;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-x: hidden;
  }

  #root {
    width: 100%;
    max-width: 1400px;  
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* Center header section with download buttons */
.header-container {
  max-width: 600px;
  text-align: center;
  padding: 20px;
  position: absolute;
  top: 40%;
  left: 40%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header-container h1 {
  font-size: 3rem;
  font-weight: bold;
  color: #00d4ff;
  margin-bottom: 15px;
}

.header-container p {
  font-size: 1.2rem;
  color: #ccc;
  margin-bottom: 30px;
}

  /* Center download buttons below the text */
.download-buttons {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.download-button {
  background-color: #333;
  color: #ffffff;
  padding: 15px 30px;
  border-radius: 10px;
  font-size: 1rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background-color 0.3s ease-in-out;
}

.download-button:hover {
  background-color: #444;
}

  /* Chart image section styling */
  .chart-container {
    max-width: 550px; 
    position: absolute;
    right: 50px;
    top: 50%;
    transform: translateY(-50%);
  }

  .chart-container img {
    width: 100%;  
    height: 550px;  
    object-fit: cover;  
    border-radius: 20px;  
    box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.3);
    opacity: 0.6;
  }

  /* Subscribe section styles */
  .subscribe-container {
    position: fixed;
    bottom: 50px;
    left: 42%;
    transform: translateX(-50%);
    text-align: center;
    width: 100%;
    max-width: 600px;
  }

  .subscribe-container h3 {
    font-size: 1.8rem;
    font-weight: bold;
    color: #ffffff;
    margin-bottom: 15px;
    position: relative;
    left: -1.5cm;
  }

  .subscribe-form {
    display: flex;
    justify-content: center;
    gap: 10px;
  }

  .subscribe-form input {
    padding: 15px;
    border-radius: 30px;
    border: none;
    width: 400px;
    outline: none;
    font-size: 1rem;
  }

  .subscribe-form button {
    background-color: #00d4ff;
    color: #000;
    border: none;
    padding: 15px 25px;
    border-radius: 30px;
    font-weight: bold;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;
  }

  .subscribe-form button:hover {
    background-color: #008db8;
  }

  /* Responsive adjustments */
  @media (max-width: 1024px) {
    .header-container {
      width: 90%;
    }

    .download-buttons {
      flex-direction: column;
      align-items: center;
    }

    .download-button {
      width: 80%;
      text-align: center;
    }

    .chart-container {
      position: static;
      margin: 50px auto;
      max-width: 80%;
      transform: none;
      text-align: center;
    }

    .chart-container img {
      width: 80%;
      height: auto;  
    }
  }

  @media (max-width: 768px) {
    .header-container h1 {
      font-size: 2rem;
    }

    .header-container p {
      font-size: 1rem;
    }

    .download-buttons {
      flex-direction: column;
      align-items: center;
    }

    .download-button {
      width: 100%;
    }

    .subscribe-container {
      bottom: 20px;
    }

    .subscribe-form input {
      width: 250px;
    }

    .subscribe-form button {
      padding: 12px 20px;
    }
  }
`;

export default GlobalStyles;
