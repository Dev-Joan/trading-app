import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

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

const bounceAnimation = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120px 40px 40px; /* Extra top padding moves content down */
  min-height: 100vh;
  background: #2E004F; /* Dark purple background */
`;

const GradientHeader = styled.h1`
  margin-bottom: 20px;
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  background: linear-gradient(270deg, #00d4ff, #ffffff, #00d4ff);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: ${gradientShift} 6s ease infinite;
`;

const GradientDescription = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  max-width: 600px;
  margin-bottom: 40px;
  background: linear-gradient(270deg, #00d4ff, #ffffff, #00d4ff);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: ${gradientShift} 6s ease infinite;
`;

const PlansContainer = styled.div`
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
  flex-wrap: wrap;
  justify-content: center;
`;

const PlanCard = styled.div`
  background: linear-gradient(180deg, #4B0082, #9966CC); /* Gradient from purple to amethyst */
  border: 1px solid cyan; /* Thin cyan border */
  border-radius: 10px;
  padding: 50px 30px;  /* More vertical padding for a longer look */
  width: 300px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease, border 0.3s ease;
  &:hover {
    transform: scale(1.05);
    border: 1px solid #00d4ff;
  }
`;

const PlanTitle = styled.h3`
  margin: 0;
  margin-bottom: 10px;
  font-size: 1.8rem;
  color: #fff;
`;

const PlanPrice = styled.p`
  font-size: 1.3rem;
  color: cyan;
  margin: 10px 0;
`;

const PlanFeatures = styled.ul`
  list-style: none;
  padding: 0;
  font-size: 1rem;
  color: #fff;
  margin: 20px 0 10px 0;
`;

const FeatureItem = styled.li`
  margin-bottom: 8px;
`;

const EmailRow = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  max-width: 450px;
  margin-top: 20px;
`;

const EmailInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #00d4ff; /* Cyan border */
  border-radius: 5px;
  font-size: 1rem;
  background: linear-gradient(90deg, #e0f7ff, #ffffff); /* Light gradient background */
  color: #333;
`;

const SubscribeButton = styled.button`
  background: #66e0ff; /* Less intense cyan */
  color: #fff;
  border: none;
  padding: 12px 20px;
  font-size: 1.1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
  animation: ${bounceAnimation} 2s infinite;
  &:hover {
    background: #55ccff;
  }
`;

const Subscribe = () => {
  const [selectedPlan, setSelectedPlan] = useState('free');
  const [email, setEmail] = useState('');

  const plans = [
    {
      id: 'free',
      title: 'Free Tier',
      price: 'Free',
      features: ['Basic lessons', 'Limited simulations'],
    },
    {
      id: 'platinum',
      title: 'Platinum Tier',
      price: '$2.99/month',
      features: ['Advanced lessons', 'Real time data'],
    },
    {
      id: 'premium',
      title: 'Premium Tier',
      price: '$9.99/month',
      features: ['Advanced lessons', 'Real time data', 'Trading'],
    },
  ];

  // When a plan is clicked the selected plan should update
  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
  };

  // Handle the form submission.
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Subscription Details:', { selectedPlan, email });
    alert(`Subscribed to the ${selectedPlan} plan with email: ${email}`);
  };

  return (
    <Container>
      <GradientHeader>Subscribe</GradientHeader>
      <GradientDescription>
        Choose a plan that fits your needs and enjoy our trading app features.
      </GradientDescription>
      <PlansContainer>
        {plans.map((plan) => (
          <PlanCard 
            key={plan.id} 
            onClick={() => handlePlanSelect(plan.id)}
            style={{
              borderColor: selectedPlan === plan.id ? 'cyan' : '#ddd'
            }}
          >
            <PlanTitle>{plan.title}</PlanTitle>
            <PlanPrice>{plan.price}</PlanPrice>
            <PlanFeatures>
              {plan.features.map((feature, index) => (
                <FeatureItem key={index}>{feature}</FeatureItem>
              ))}
            </PlanFeatures>
          </PlanCard>
        ))}
      </PlansContainer>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '450px' }}>
        <EmailRow>
          <EmailInput
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <SubscribeButton type="submit">Subscribe!</SubscribeButton>
        </EmailRow>
      </form>
    </Container>
  );
};

export default Subscribe;
