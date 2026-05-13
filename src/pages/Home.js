// Home.js

import React from 'react';
import Header from '../components/Header';
import {ChartComponent} from '../components/ChartComponent';
// import SubscriptionForm from '../components/SubscriptionForm';
import styled from 'styled-components';

// styling container for a home page, im using flexbox to center content
const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

// wrapping content for a large screens and stacking them for a small screens
const ContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1400px;
  margin-top: 100px; /* Adjust to prevent overlap with navbar */

  @media (max-width: 1024px) 
  {
    flex-direction: column;
    align-items: center;
  }
`;


// basic component to display home page
const Home = () =>
{
  return (
    <HomeContainer>
      <ContentWrapper>
        <Header />
        <ChartComponent />
      </ContentWrapper>
    </HomeContainer>
  );
};

export default Home;
