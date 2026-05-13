
import React, { useState } from 'react';
import { validatePassword } from '../server/passwordValidation';
import authInfo from '../server/AuthInfo';
import { useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle, keyframes } from 'styled-components';

// Global style to normalize default browser styles
const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  html {
    font-size: 16px;
  }
  body {
    font-family: 'Arial', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;


const StyledRegisterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 120px 40px 40px;
  text-align: center;
  background: #2E004F;

  h1 {
    margin-bottom: 20px;
    font-size: 2.5rem;
    font-weight: bold;
    background: linear-gradient(270deg, #00d4ff, #ffffff, #00d4ff);
    background-size: 400% 400%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: ${gradientShift} 6s ease infinite;
  }

  h2 {
    margin-bottom: 20px;
    font-size: 2rem;
    font-weight: bold;
    color: #fff;
  }

  label {
    font-size: 1.2rem;
    color: #fff;
    margin-right: 10px;
  }

  input {
    padding: 10px;
    border: 1px solid #00d4ff;
    border-radius: 5px;
    font-size: 1rem;
    background: linear-gradient(90deg, #e0f7ff, #ffffff);
    color: #333;
    margin-bottom: 20px;
  }

  button {
    background: #66e0ff;
    color: #fff;
    border: none;
    padding: 12px 20px;
    font-size: 1.1rem;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s ease;
    &:hover {
      background: #55ccff;
    }
  }

  .error {
    color: red;
    margin-bottom: 20px;
  }

  .password-rules {
    margin-top: 10px;
  }

  .password-rules .invalid {
    color: red;
  }
`;

const Register = () => {	
	// State variables to manage form inputs and validation
	let [username, setUsername] = useState('');
	let [password, setPassword] = useState('');
	let [validation, setValidation] = useState(null);
	let [error, setError] = useState('');

	const navigate = useNavigate();

	// Handles password input changes and validates in real-time
	let handlePasswordChange = (e) => {
		let password = e.target.value;
		setPassword(password);		
		setValidation(validatePassword(password));
	};

	// Handles form submission
	let handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await authInfo.register(username, password);
			setError(''); // Clears any existing errors, not sure if needed here?
			navigate('/login'); // Shown from https://ui.dev/react-router-programmatically-navigate
			// alert('Registration successful!');
		} catch (err) {
			setError(err.message); // Display error message if registration fails
		}
	};

	return (
		<StyledRegisterWrapper>
      <GlobalStyle />
			{/* Main container with centered content */}
			{/* The inline styling below is kept intact */}
			<div style={{
				display: 'flex', 
				flexDirection: 'column', 
				justifyContent: 'center', 
				alignItems: 'center', 
				height: '100vh', 
				textAlign: 'center'
			}}>
				<h1>Register </h1>
				{/* Registration Form */}
				<form onSubmit={handleSubmit}>
					<div>
						<label>Username:</label>
						<input
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
						/>
					</div>
					{/* Password field */}
					<div>
						<label>Password:</label>
						<input
							type="password"
							value={password}
							onChange={handlePasswordChange}
							required
						/>
						{/* When there are errors, it should show them here */}
						{validation && (
							<div className="password-rules" style={{color: 'red'}}>
								{validation.errors
									.filter(rule => !rule.valid) 
									.map((rule) => (
										<div key={rule.id} className={rule.valid ? 'valid' : 'invalid'}>
											{rule.message}
										</div>
									))}
							</div>
						)}				
					</div>

					{/* Errors */}
					{error && <div className="error">{error}</div>}
					
					{/* Submit button */}
					<button type="submit" disabled={!validation?.isValid}>
						Register
					</button>
				</form>
			</div>
		</StyledRegisterWrapper>
	);
};

export default Register;
