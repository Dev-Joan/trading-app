import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaCog } from 'react-icons/fa';
import { useAuth } from '../server/AuthClasses/AuthContext';

// Navbar Styles
const NavbarContainer = styled.nav`
  display: flex;
  justify-content: center;  
  align-items: center;
  width: 100%;
  position: fixed;  
  top: 0;
  left: 0;
  background: linear-gradient(90deg, #4B0082, #9966CC);
  padding: 20px 0;
  z-index: 1000;
  box-sizing: border-box;
`;

const NavList = styled.ul`
  list-style: none;
  display: flex;
  justify-content: center;  
  align-items: center;
  padding: 0;
  margin: 0 auto;
  gap: 50px;
  max-width: 1200px;  
  width: 100%;

  @media (max-width: 1024px) {
    gap: 20px;
  }
  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 15px;
  }
`;

const NavItem = styled.li`
  font-size: 1rem;
  font-weight: bold;
  color: #ffffff;
  cursor: pointer;
  transition: color 0.3s ease-in-out;

  &:hover {
    color: #00d4ff;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const StyledButton = styled.button`
  text-decoration: none;
  color: inherit;
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
`;

const RegisterButton = styled.li`
  background: #a855f7;
  padding: 10px 20px;
  border-radius: 20px;
  color: #000;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background: #9333ea;
  }
`;

const SettingsIcon = styled(FaCog)`
  font-size: 1.5rem;
  color: #ffffff;
  margin-left: 20px;
  cursor: pointer;
  transition: color 0.3s ease-in-out;

  &:hover {
    color: #00d4ff;
  }
`;

// Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1100;
`;

const ModalContent = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(to bottom, #2E004F, #800080);
  width: 30vw;   
  height: 70vh;  
  border: 2px solid cyan;  
  border-radius: 20px;
  z-index: 1200;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
  padding: 2rem;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  background: transparent;
  border: 1px solid cyan; 
  border-radius: 4px;
  color: cyan;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalHeader = styled.h2`
  text-align: center;
  color: #fff;
  margin-top: 10px;
`;

// Form Section Styles
const Section = styled.div`
  margin-top: 20px;
  color: #fff;
`;

const SectionTitle = styled.h3`
  margin: 0;
  padding-bottom: 5px;
  font-size: 1.1rem;
  border-bottom: 1px solid cyan;
`;

const FieldGroup = styled.div`
  margin-bottom: 10px;
`;

const Label = styled.label`
  font-size: 0.9rem;
  margin-right: 10px;
`;

const Select = styled.select`
  padding: 4px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const Input = styled.input`
  padding: 4px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const CheckboxLabel = styled.label`
  font-size: 0.9rem;
  margin-left: 5px;
`;

// Terms and Conditions Container
const TermsContainer = styled.div`
  margin-top: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid cyan;
  border-radius: 4px;
  padding: 10px;
  max-height: 150px;
  overflow-y: auto;
  font-size: 0.8rem;
  color: #fff;
`;

// Save Button
const SaveButton = styled.button`
  background: cyan;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  color: #000;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    background: #00d4ff;
  }
`;

// Settings Modal Component 
const SettingsModal = ({ onClose }) => {
  // Trading Preferences state
  const [orderType, setOrderType] = React.useState('market');
  const [refreshInterval, setRefreshInterval] = React.useState('10');
  const [simulationSpeed, setSimulationSpeed] = React.useState('normal');

  // Regional Settings state
  const [language, setLanguage] = React.useState('en');
  const [region, setRegion] = React.useState('america');
  const [currency, setCurrency] = React.useState('usd');

  // Privacy & Data Settings state
  const [dataSharing, setDataSharing] = React.useState(false);
  const [cookieTracking, setCookieTracking] = React.useState(false);
  const [termsAccepted, setTermsAccepted] = React.useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    const settings = {
      tradingPreferences: {
        orderType,
        refreshInterval,
        simulationSpeed,
      },
      regionalSettings: {
        language,
        region,
        currency,
      },
      privacySettings: {
        dataSharing,
        cookieTracking,
        termsAccepted,
      },
    };
    console.log('Saved Settings:', settings);
    onClose(); // Close the modal after saving
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>X</CloseButton>
        <ModalHeader>Settings</ModalHeader>
        <form onSubmit={handleSave}>
          <Section>
            <SectionTitle>Trading Preferences</SectionTitle>
            <FieldGroup>
              <Label>Default Order Type:</Label>
              <Select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
                <option value="market">Market</option>
                <option value="limit">Limit</option>
                <option value="stop-loss">Stop-loss</option>
              </Select>
            </FieldGroup>
            <FieldGroup>
              <Label>Auto-refresh Interval (seconds):</Label>
              <Select value={refreshInterval} onChange={(e) => setRefreshInterval(e.target.value)}>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="30">30</option>
                <option value="60">60</option>
              </Select>
            </FieldGroup>
            <FieldGroup>
              <Label>Simulation Speed:</Label>
              <Select value={simulationSpeed} onChange={(e) => setSimulationSpeed(e.target.value)}>
                <option value="slow">Slow</option>
                <option value="normal">Normal</option>
                <option value="fast">Fast</option>
              </Select>
            </FieldGroup>
          </Section>

          <Section>
            <SectionTitle>Regional Settings</SectionTitle>
            <FieldGroup>
              <Label>Language:</Label>
              <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="es">Spanish</option>
                <option value="ar">Arabic</option>
              </Select>
            </FieldGroup>
            <FieldGroup>
              <Label>Region:</Label>
              <Select value={region} onChange={(e) => setRegion(e.target.value)}>
                <option value="america">America</option>
                <option value="europe">Europe</option>
                <option value="asia">Asia</option>
              </Select>
            </FieldGroup>
            <FieldGroup>
              <Label>Currency:</Label>
              <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="usd">USD</option>
                <option value="euros">Euros</option>
                <option value="pounds">Pounds</option>
              </Select>
            </FieldGroup>
          </Section>

          <Section>
            <SectionTitle>Privacy &amp; Data Settings</SectionTitle>
            <FieldGroup>
              <Input
                type="checkbox"
                checked={dataSharing}
                onChange={(e) => setDataSharing(e.target.checked)}
                id="dataSharing"
              />
              <CheckboxLabel htmlFor="dataSharing">Allow Data Sharing</CheckboxLabel>
            </FieldGroup>
            <FieldGroup>
              <Input
                type="checkbox"
                checked={cookieTracking}
                onChange={(e) => setCookieTracking(e.target.checked)}
                id="cookieTracking"
              />
              <CheckboxLabel htmlFor="cookieTracking">Enable Cookie Tracking</CheckboxLabel>
            </FieldGroup>
            <FieldGroup>
              <Input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                id="termsAccepted"
              />
              <CheckboxLabel htmlFor="termsAccepted">
                I agree to the Terms and Conditions
              </CheckboxLabel>
            </FieldGroup>
          </Section>

          <Section>
            <SectionTitle>Terms and Conditions</SectionTitle>
            <TermsContainer>
              <p>
                These Terms and Conditions govern your use of this application. By accessing or using our services, you agree to be bound by these Terms and Conditions. 
                <br /><br />
                1. <strong>Acceptance:</strong> By using this service, you accept all terms and conditions outlined herein.
                <br /><br />
                2. <strong>Usage:</strong> You agree to use this service for lawful purposes only. Any unauthorized use may result in suspension or termination of your account.
                <br /><br />
                3. <strong>Data Protection:</strong> Your personal data will be processed in accordance with our Privacy Policy and applicable data protection laws.
                <br /><br />
                4. <strong>Changes:</strong> We reserve the right to modify these Terms and Conditions at any time. Continued use of the service constitutes acceptance of any changes.
                <br /><br />
                5. <strong>Limitation of Liability:</strong> In no event shall we be liable for any direct, indirect, incidental, or consequential damages arising from your use of the service.
                <br /><br />
                Please review these terms carefully before using our service.
              </p>
            </TermsContainer>
          </Section>

          <SaveButton type="submit">Save Settings</SaveButton>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

// Navbar Component
const Navbar = () => {
	const { isDefaultProfile, setLogout } = useAuth();
  const [showSettings, setShowSettings] = React.useState(false);

  const handleSettingsClick = () => {
    setShowSettings(true);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  return (
    <>
      <NavbarContainer>
        <NavList>
          <NavItem><StyledLink to="/">Home</StyledLink></NavItem>
          <NavItem><StyledLink to="/learn">Learn</StyledLink></NavItem>
          <NavItem><StyledLink to="/practice">Practice</StyledLink></NavItem>
          <NavItem><StyledLink to="/trade">Trade</StyledLink></NavItem>
          <NavItem><StyledLink to="/subscribe">Subscribe</StyledLink></NavItem>
          <NavItem><StyledLink to="/portfolio">Portfolio</StyledLink></NavItem>
			{!isDefaultProfile ? (
            <>
              {/* <NavItem><StyledLink to="/profile">Profile</StyledLink></NavItem> */}
			<NavItem><StyledButton as="button" onClick={setLogout}>Logout</StyledButton></NavItem>
            </>
          ) : (
            <>
              <NavItem><StyledLink to="/login">Login</StyledLink></NavItem>
              <StyledLink to="/register">
                <RegisterButton>Register</RegisterButton>
              </StyledLink>
            </>
          )}
          <SettingsIcon onClick={handleSettingsClick} />
        </NavList>
      </NavbarContainer>
      {showSettings && <SettingsModal onClose={handleCloseSettings} />}
    </>
  );
};

export default Navbar;

