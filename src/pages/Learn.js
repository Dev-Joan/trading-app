import React, { useState, useEffect, useRef } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from 'recharts';

import {
  FaTachometerAlt,
  FaBook,
  FaEnvelope,
  FaCalendarAlt,
  FaUsers,
  FaCog,
  FaPodcast,
  FaVideo,
  FaNewspaper,
  FaQuestionCircle,
  FaLock,
  FaStar,
  FaCheck,
} from 'react-icons/fa';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Poppins', sans-serif;
    background-color: #121212;
    overflow-y: auto;
  }
  /* Override some react-calendar styles for dark theme */
  .react-calendar {
    background: #fff;
    border: 1px solid cyan;
    border-radius: 10px;
    color: #000;
    width: 100% !important;
    height: 100% !important;
    box-sizing: border-box;
  }
  .react-calendar__navigation button {
    color: indigo;
    min-width: 44px;
    background: none;
    font-size: 1rem;
    margin: 2px;
  }
  .react-calendar__tile {
    background: transparent;
    border: none;
    position: relative;
    padding: 10px;
    margin: 2px;
    border-radius: 5px;
    transition: all 0.3s;
  }
  .react-calendar__tile:enabled:hover {
    background: transparent;
    border: 1px solid cyan;
    border-radius: 5px;
  }
  .react-calendar__tile--active {
    background: #7df9ff !important;
    color: #121212 !important;
    border-radius: 5px;
  }
`;

// Animation keyframes for visual effects
const floatAnim = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); } /* Moves element up */
  100% { transform: translateY(0px); } /* Returns to original position */
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); } /* Fades in and moves down */ 
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 10px rgba(255, 255, 255, 0.2); }
  50% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.5); }
  100% { box-shadow: 0 0 10px rgba(255, 255, 255, 0.2); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;


// Styled component for a reusable back button 
const BackButton = styled.button`
  background: #9966cc;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  &:hover {
    background: #b19cd9;
  }
`;

// Container for course content with consistent styling
const CourseContentContainer = styled.div`
  padding: 20px;
  background-color: #1a1a2e;
  border-radius: 10px;
  margin: 20px 0;
  line-height: 1.6;
`;

// Header for course modules with a cyan underline
const ModuleHeader = styled.h2`
  color: #7df9ff;
  margin-bottom: 10px;
  border-bottom: 2px solid cyan;
  padding-bottom: 5px;
`;

// Section for individual lessons within a module
const LessonSection = styled.div`
  margin: 20px 0;
`;

// Title for each lesson
const LessonTitle = styled.h3`
  color: #ffffff;
  margin-bottom: 10px;
`;

// Objective statement for lessons, italicized for emphasis
const LessonObjective = styled.p`
  color: #dddddd;
  font-style: italic;
`;

// Definitions within lessons
const LessonDefinition = styled.p`
  color: #ffffff;
  margin: 10px 0;
`;

// List of key points for lessons
const LessonKeyPoints = styled.ul`
  margin: 10px 0;
  padding-left: 20px;
  color: #ffffff;
`;

// Individual key point in the list
const LessonKeyPoint = styled.li`
  margin-bottom: 5px;
`;

// Activity section with a cyan border accent
const LessonActivity = styled.div`
  margin-top: 10px;
  padding: 10px;
  background: #222;
  border-left: 4px solid cyan;
  color: #ffffff;
`;

// Container for quiz sections
const QuizSection = styled.div`
  margin-top: 30px;
  padding: 20px;
  background-color: #222;
  border-radius: 10px;
`;

// Header for quizzes
const QuizHeader = styled.h2`
  color: #7df9ff;
  margin-bottom: 20px;
`;

// Container for each quiz question
const QuestionContainer = styled.div`
  margin-bottom: 20px;
`;

// Container for quiz options with hover effects
const OptionContainer = styled.div`
  padding: 10px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s, color 0.3s;
`;

//API credentials
const API_KEY = "AIzaSyDRYXDsmqLAlLIeKb7MNDybPKqH60jPkr8";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// Dashboard and courses data
const myCoursesData = [
  {
    id: 1,
    title: "Stock Market Basics",
    description:
      "Learn the fundamentals of the stock market, including how exchanges work and what determines stock prices.",
    topics: [
      "Introduction to Financial Markets",
      "How Stock Exchanges Work (NYSE, NASDAQ, LSE, etc.)",
      "Types of Stocks (Common vs. Preferred)",
      "How to Read Financial Statements (Balance Sheet, Income Statement, Cash Flow)",
      "Risk Management & Market Influences",
    ],
  },
  {
    id: 2,
    title: "Fundamental Analysis (For Long-Term Investing)",
    description:
      "Master the art of analyzing financial statements and market conditions to make informed long-term investments.",
    topics: [
      "How to Read Financial Statements (Balance Sheet, Income Statement, Cash Flow)",
      "Understanding Valuation Metrics (P/E Ratio, EPS, ROE, etc.)",
      "Economic and Industry Analysis",
      "How to Analyze Company Earnings Reports",
      "Identifying Undervalued and Overvalued Stocks",
    ],
  },
  {
    id: 3,
    title: "Technical Analysis (For Short-Term Trading)",
    description:
      "Learn the techniques of technical analysis to effectively trade in short-term markets.",
    topics: [
      "How to Read Candlestick Charts",
      "Support and Resistance Levels",
      "Moving Averages & Indicators (RSI, MACD, Bollinger Bands)",
      "Trend Analysis & Chart Patterns",
      "Trading Volume & Market Sentiment",
    ],
  },
  {
    id: 4,
    title: "Stock Trading Strategies",
    description:
      "Explore various trading strategies including day trading, swing trading, and more.",
    topics: [
      "Day Trading vs. Swing Trading vs. Position Trading",
      "Momentum Trading vs. Value Investing",
      "How to Use Stop-Loss & Take-Profit Strategies",
      "Order Types (Market, Limit, Stop-Loss, Trailing Stop)",
      "Identifying Good Entry & Exit Points",
    ],
  },
  {
    id: 5,
    title: "Risk Management & Market Influences",
    description:
      "Learn to manage risk and understand market influences to protect your investments.",
    topics: [
      "How to Manage Trading Risk (Position Sizing, Diversification)",
      "Avoiding Trading Mistakes (FOMO, Overtrading, Revenge Trading)",
      "Market Bubbles & Crashes (Recognizing Market Cycles)",
      "Interest Rates, Inflation, & How They Affect Stock Markets",
      "Global Markets & Geopolitical Risks",
    ],
  },
];

// Function to render star ratings
const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  let stars = "★".repeat(fullStars);
  if (halfStar) stars += "½";
  return stars;
};

// Left sidebar for navigation
const LeftWindow = styled.div`
  position: fixed;
  top: 80px;
  left: 0;
  width: 20%;
  height: 90%;
  background: linear-gradient(135deg, #222844, #2a1f42);
  color: #fff;
  padding: 20px;
  box-shadow: 4px 4px 10px rgba(0,0,0,0.3);
  border-right: 1px solid cyan;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
`;

// Title for the learning platform
const LearnTitle = styled.h1`
  margin: 0 0 20px 0;
  font-size: 2.5rem;
  color: #fff;
  letter-spacing: 2px;
  text-align: center;
  text-shadow: 3px 3px 6px rgba(0,0,0,0.8);
`;

// Navigation list in the sidebar
const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

// Individual navigation item with hover effect
const NavItem = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 10px 15px;
  border-radius: 5px;
  transition: background 0.3s;
  margin-bottom: 10px;
  &:hover {
    background: rgba(255,255,255,0.3);
  }
`;

// Right Container
const RightContainer = styled.div`
  position: fixed;
  top: 80px;
  right: 0;
  width: 20%;
  height: 90%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: transparent;
`;

// Chat bubble with floating animation
const ChatBubble = styled.div`
  position: relative;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  background: #2a1f42;
  color: #fff;
  font-size: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border: 2px solid cyan;
  margin: 0 auto 10px auto;
  animation: ${floatAnim} 3s ease-in-out infinite;
  &:before {
    content: "";
    position: absolute;
    bottom: -20px;
    left: 20px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #2a1f42;
    border: 2px solid cyan;
  }
  &:after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 70px;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: #2a1f42;
    border: 2px solid cyan;
  }
`;

// Container for info boxes in the right sidebar
const InfoBoxesContainer = styled.div`
  height: 75%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

// Individual info box with hover scaling
const InfoBox = styled.div`
  text-decoration: none;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80px;
  background: #2a1f42;
  padding: 8px;
  text-align: center;
  color: #fff;
  border: 1px solid cyan;
  transition: transform 0.2s ease;
  cursor: pointer;
  &:hover {
    transform: scale(1.03);
  }
`;

// Title within info boxes
const InfoTitle = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
`;

// Description within info boxes
const InfoDescription = styled.div`
  font-size: 0.8rem;
  line-height: 1.2;
`;

// News Box
const NewsBox = styled.div`
  background: linear-gradient(135deg, #8e44ad, #9966cc);
  border: 2px solid #8e44ad;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(142, 68, 173, 0.5);
  position: relative;
`;

// Title for news section
const NewsTitle = styled.h3`
  color: #fff;
  margin-bottom: 15px;
  font-size: 2rem;
  font-weight: 700;
  text-shadow: 1px 1px 4px rgba(0,0,0,0.7);
  border-bottom: 2px solid #fff;
  padding-bottom: 5px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

// Individual news item with star bullet
const NewsItem = styled.p`
  color: #fff;
  margin: 8px 0;
  font-size: 1.1rem;
  line-height: 1.5;
  position: relative;
  padding-left: 30px;
  &:before {
    content: '★';
    position: absolute;
    left: 0;
    top: 0;
    color: gold;
    font-size: 1.2rem;
  }
`;

// Rotating newspaper icon for visual flair
const RotatingLogo = styled(FaNewspaper)`
  position: absolute;
  top: 10px;
  right: 10px;
  color: rgba(255, 255, 255, 0.7);
  animation: ${rotate} 4s linear infinite; /* Continuous rotation */
  font-size: 2.5rem;
`;

// Course card with progress overlay
const CourseCard = styled.div`
  position: relative;
  border: 1px solid cyan;
  border-radius: 5px;
  padding: 4px 8px;
  background: #1c1c3a;
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8rem;
  overflow: hidden;
`;

// Overlay showing course progress
const ProgressOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${(props) => props.progress}%; /* Width based on progress */
  background-color: cyan;
  opacity: 0.3;
  z-index: 0;
`;

// Main content area in the center
const CenterContainer = styled.div`
  position: relative;
  margin: 80px auto 0 auto;
  width: 58%;
  padding: 20px;
  color: white;
  overflow-y: auto;
`;

// Header for dashboard section
const DashboardHeader = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 10px;
  text-align: left;
`;

// Subheader for sections within dashboard
const SectionHeader = styled.h3`
  font-size: 1.2rem;
  font-weight: bold;
  margin: 5px 0;
  text-align: left;
`;

// Button for enrolling or starting actions
const EnrollButton = styled.button`
  background: #7df9ff;
  color: #121212;
  border: none;
  padding: 8px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 8px;
  &:hover {
    background: cyan;
  }
`;

// Sidebar for available courses
const CoursesSidebarContainer = styled.div`
  position: fixed;
  top: 80px;
  right: 0;
  width: 300px;
  height: calc(100vh - 80px);
  background: #1c1c3a;
  border-left: 1px solid cyan;
  padding: 10px;
  overflow-y: auto;
`;

// Individual item in the sidebar
const SidebarItem = styled.div`
  border: 1px solid cyan;
  border-radius: 5px;
  padding: 8px;
  margin-bottom: 10px;
  background: #2a1f42;
  cursor: pointer;
`;

// Component for the available courses sidebar
const AvailableCoursesSidebar = ({ availableCourses, onEnrollCourse }) => {
  return (
    <CoursesSidebarContainer>
      <h3 style={{ color: '#fff', marginBottom: '10px' }}>Available Courses</h3>
      {availableCourses.map((course) => (
        <SidebarItem key={course.id}>
          <div style={{ fontWeight: 'bold', color: '#fff' }}>{course.title}</div>
          <div style={{ fontSize: '0.8rem', color: '#ccc', marginBottom: '5px' }}>
            {course.description.substring(0, 60)}...
          </div>
          {course.id === 5 ? (
            <EnrollButton disabled style={{ backgroundColor: 'grey', cursor: 'not-allowed' }}>
              Coming Soon
            </EnrollButton>
          ) : (
            <EnrollButton onClick={(e) => { e.stopPropagation(); onEnrollCourse(course); }}>
              Enroll
            </EnrollButton>
          )}
        </SidebarItem>
      ))}
    </CoursesSidebarContainer>
  );
};

// Container for progress bars
const ProgressBarContainer = styled.div`
  width: 100%;
  background-color: #333;
  border-radius: 5px;
  margin-top: 10px;
`;

// Filler for progress bars showing completion
const ProgressBarFiller = styled.div`
  height: 10px;
  width: ${(props) => props.progress}%; /* Width based on progress */
  background-color: cyan;
  border-radius: inherit;
  transition: width 0.5s ease-in-out;
`;

// Financial Market Content
const FinancialMarketsContent = ({ course, unitIndex, onMarkUnitComplete, onBack }) => {
  return (
    <CourseContentContainer>
      <BackButton onClick={onBack}>Back to Topics</BackButton>
      <ModuleHeader>Introduction to Financial Markets</ModuleHeader>

      <LessonSection>
        <LessonTitle>Lesson 1: What Are Financial Markets?</LessonTitle>
        <LessonObjective>
          Objective: Understand what financial markets are and their role in the economy.
        </LessonObjective>
        <LessonDefinition>
          Definition: Financial markets are systems or platforms where individuals and institutions trade financial assets such as stocks, bonds, commodities, and currencies. They enable the flow of capital by connecting savers with those in need of funding.
        </LessonDefinition>
        <LessonKeyPoints>
          <LessonKeyPoint><strong>Capital Flow:</strong> Facilitate capital raising through stock and bond issuance.</LessonKeyPoint>
          <LessonKeyPoint><strong>Investment:</strong> Provide opportunities for wealth growth.</LessonKeyPoint>
          <LessonKeyPoint><strong>Risk Management:</strong> Offer tools like derivatives to hedge risks.</LessonKeyPoint>
          <LessonKeyPoint><strong>Price Discovery:</strong> Help determine asset prices based on supply and demand.</LessonKeyPoint>
          <LessonKeyPoint><strong>Liquidity:</strong> Enable easy buying and selling of assets without drastic price changes.</LessonKeyPoint>
        </LessonKeyPoints>
        <LessonActivity>
          Activity: Think of a company you admire. Research how it raises capital (via stocks or bonds) and examine how its stock price is determined.
        </LessonActivity>
      </LessonSection>

      <LessonSection>
        <LessonTitle>Lesson 2: Types of Financial Markets</LessonTitle>
        <LessonObjective>
          Objective: Learn about different financial markets and their functions.
        </LessonObjective>
        <LessonDefinition>
          <strong>Capital Markets:</strong> Platforms for buying and selling long-term debt or equity securities.
        </LessonDefinition>
        <LessonKeyPoints>
          <LessonKeyPoint><strong>Primary Market:</strong> Where new securities are issued (e.g., IPOs).</LessonKeyPoint>
          <LessonKeyPoint><strong>Secondary Market:</strong> Where existing securities are traded (e.g., NYSE, NASDAQ).</LessonKeyPoint>
        </LessonKeyPoints>
        <LessonDefinition>
          <strong>Money Markets:</strong> Deal with short-term funding using instruments like Treasury bills and CDs.
        </LessonDefinition>
        <LessonDefinition>
          <strong>Foreign Exchange (Forex) Markets:</strong> Facilitate currency trading and operate 24/7.
        </LessonDefinition>
        <LessonDefinition>
          <strong>Derivatives Markets:</strong> Provide financial contracts (futures, options, swaps) based on underlying assets.
        </LessonDefinition>
        <LessonDefinition>
          <strong>Commodities Markets:</strong> Enable trading in raw materials (oil, gold, wheat) often using futures.
        </LessonDefinition>
        <LessonActivity>
          Activity: Research a recent IPO. How did the company raise capital and which market did it use?
        </LessonActivity>
      </LessonSection>

      <LessonSection>
        <LessonTitle>Lesson 3: Participants in Financial Markets</LessonTitle>
        <LessonObjective>
          Objective: Understand the key players and their roles.
        </LessonObjective>
        <LessonDefinition>
          <strong>Investors:</strong> Individuals or institutions investing for wealth accumulation.
        </LessonDefinition>
        <LessonDefinition>
          <strong>Issuers:</strong> Entities (governments or corporations) that issue financial instruments to raise capital.
        </LessonDefinition>
        <LessonDefinition>
          <strong>Brokers and Dealers:</strong> Brokers facilitate trades while dealers trade for their own accounts.
        </LessonDefinition>
        <LessonDefinition>
          <strong>Regulators:</strong> Ensure market fairness and transparency (e.g., SEC, FCA).
        </LessonDefinition>
        <LessonActivity>
          Activity: Research a major financial market regulator and summarize its role in ensuring market efficiency.
        </LessonActivity>
      </LessonSection>

      <LessonSection>
        <LessonTitle>Lesson 4: Key Concepts in Financial Markets</LessonTitle>
        <LessonObjective>
          Objective: Learn the fundamental concepts that drive market behavior.
        </LessonObjective>
        <LessonDefinition>
          <strong>Liquidity:</strong> The ease with which an asset can be bought or sold without a significant price change.
        </LessonDefinition>
        <LessonDefinition>
          <strong>Volatility:</strong> The degree of price fluctuation of an asset.
        </LessonDefinition>
        <LessonDefinition>
          <strong>Market Efficiency:</strong> The theory that asset prices fully reflect all available information.
        </LessonDefinition>
        <LessonKeyPoints>
          <LessonKeyPoint><strong>Weak Form:</strong> Past market data is reflected in prices.</LessonKeyPoint>
          <LessonKeyPoint><strong>Semi-Strong Form:</strong> Public information is fully reflected in prices.</LessonKeyPoint>
          <LessonKeyPoint><strong>Strong Form:</strong> All information, including insider data, is reflected in prices.</LessonKeyPoint>
        </LessonKeyPoints>
        <LessonActivity>
          Activity: Analyze a stock you have been tracking. Do its price movements suggest market efficiency? Explain your reasoning.
        </LessonActivity>
      </LessonSection>

      <QuizSection>
        <QuizHeader>Quiz: Overview of Financial Markets</QuizHeader>
        <FinancialMarketsQuiz />
      </QuizSection>

      <EnrollButton onClick={() => { onMarkUnitComplete(course.id, unitIndex); onBack(); }}>
        Mark Topic Complete
      </EnrollButton>
    </CourseContentContainer>
  );
};

const FinancialMarketsQuiz = () => {
  const quizData = [
    {
      question: "1. What is the primary function of financial markets?",
      options: [
        { value: 'a', text: "To regulate company profits" },
        { value: 'b', text: "To provide a platform for buying and selling goods" },
        { value: 'c', text: "To facilitate the flow of capital between savers and borrowers" },
        { value: 'd', text: "To create new currencies" },
      ],
      correctAnswer: 'c',
    },
    {
      question: "2. Which of the following is a characteristic of the money market?",
      options: [
        { value: 'a', text: "Long-term investment in stocks" },
        { value: 'b', text: "Trading of short-term securities with maturities of less than one year" },
        { value: 'c', text: "Exchange of currencies" },
        { value: 'd', text: "Speculative trading of commodities" },
      ],
      correctAnswer: 'b',
    },
    {
      question: "3. What is the role of an issuer in the financial markets?",
      options: [
        { value: 'a', text: "To trade securities for their own account" },
        { value: 'b', text: "To create and sell financial instruments to raise capital" },
        { value: 'c', text: "To facilitate trades between buyers and sellers" },
        { value: 'd', text: "To regulate financial transactions" },
      ],
      correctAnswer: 'b',
    },
    {
      question: "4. What does liquidity in financial markets refer to?",
      options: [
        { value: 'a', text: "The ability to buy or sell an asset without affecting its price significantly" },
        { value: 'b', text: "The risk involved in trading securities" },
        { value: 'c', text: "The efficiency of a stock exchange" },
        { value: 'd', text: "The volatility of asset prices over time" },
      ],
      correctAnswer: 'a',
    },
    {
      question: "5. Which of the following is NOT a type of financial market?",
      options: [
        { value: 'a', text: "Capital Market" },
        { value: 'b', text: "Money Market" },
        { value: 'c', text: "Stock Market" },
        { value: 'd', text: "Commodities Market" },
      ],
      correctAnswer: 'c',
    },
    {
      question: "6. What is the Efficient Market Hypothesis (EMH)?",
      options: [
        { value: 'a', text: "The idea that markets are inefficient and prices often do not reflect available information" },
        { value: 'b', text: "The belief that anyone can consistently beat the market by picking the right stocks" },
        { value: 'c', text: "The theory that asset prices fully reflect all available information" },
        { value: 'd', text: "The concept that financial markets are only regulated by governments" },
      ],
      correctAnswer: 'c',
    },
    {
      question: "7. Who are considered institutional investors?",
      options: [
        { value: 'a', text: "Private individuals who invest their personal savings" },
        { value: 'b', text: "Large entities like pension funds, hedge funds, and insurance companies" },
        { value: 'c', text: "Government agencies that issue bonds" },
        { value: 'd', text: "Retail brokers facilitating trades between buyers and sellers" },
      ],
      correctAnswer: 'b',
    },
    {
      question: "8. Which of the following markets operates 24/7?",
      options: [
        { value: 'a', text: "Capital Market" },
        { value: 'b', text: "Foreign Exchange (Forex) Market" },
        { value: 'c', text: "Money Market" },
        { value: 'd', text: "Commodities Market" },
      ],
      correctAnswer: 'b',
    },
    {
      question: "9. What is a primary market?",
      options: [
        { value: 'a', text: "A market where existing securities are traded among investors" },
        { value: 'b', text: "A market where newly issued securities are sold for the first time" },
        { value: 'c', text: "A market where currencies are exchanged" },
        { value: 'd', text: "A market for trading short-term debt instruments" },
      ],
      correctAnswer: 'b',
    },
    {
      question: "10. What does volatility refer to in financial markets?",
      options: [
        { value: 'a', text: "The average price of an asset over time" },
        { value: 'b', text: "The degree of price fluctuation of an asset" },
        { value: 'c', text: "The amount of capital invested in the market" },
        { value: 'd', text: "The number of investors involved in the market" },
      ],
      correctAnswer: 'b',
    },
  ];

  const [selectedAnswers, setSelectedAnswers] = useState({});

  // Handles selecting an answer and locks it after selection
  const handleOptionChange = (qIndex, value) => {
    if (selectedAnswers[qIndex] !== undefined) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: value }));
  };

    // Styles options based on correctness after selection
  const getOptionStyle = (qIndex, optionValue, correctAnswer) => {
    const selected = selectedAnswers[qIndex];
    const baseStyle = {};
    if (selected === undefined) {
      return baseStyle;
    }
    if (optionValue === selected) {
      if (selected === correctAnswer) {
        return { backgroundColor: '#d4edda', borderColor: 'green', color: 'green' }; // Correct answer
      } else {
        return { backgroundColor: '#f8d7da', borderColor: 'red', color: 'red' }; // Incorrect answer
      }
    } else if (selected !== correctAnswer && optionValue === correctAnswer) {
      return { backgroundColor: '#d4edda', borderColor: 'green', color: 'green' }; // Show correct answer
    }
    return baseStyle;
  };

  return (
    <div>
      {quizData.map((q, qIndex) => (
        <QuestionContainer key={qIndex}>
          <p style={{ color: '#fff', fontWeight: 'bold' }}>{q.question}</p>
          {q.options.map((option) => (
            <OptionContainer
              key={option.value}
              style={getOptionStyle(qIndex, option.value, q.correctAnswer)}
              onClick={() => handleOptionChange(qIndex, option.value)}
            >
              <input
                type="radio"
                name={`question-${qIndex}`}
                value={option.value}
                checked={selectedAnswers[qIndex] === option.value}
                onChange={() => handleOptionChange(qIndex, option.value)}
                style={{ marginRight: '10px' }}
                disabled={selectedAnswers[qIndex] !== undefined} // Locks after selection
              />
              <label>{option.value}) {option.text}</label>
            </OptionContainer>
          ))}
        </QuestionContainer>
      ))}
    </div>
  );
};

//Stock Exchange content
const StockExchangesContent = ({ course, unitIndex, onMarkUnitComplete, onBack }) => {
  return (
    <CourseContentContainer>
      <BackButton onClick={onBack}>Back to Topics</BackButton>
      
      <ModuleHeader>Module 1: Introduction to Stock Exchanges</ModuleHeader>
      <LessonSection>
        <LessonTitle>Lesson 1: What is a Stock Exchange?</LessonTitle>
        <LessonObjective>
          Objective: Understand the concept of a stock exchange and its role in the global economy.
        </LessonObjective>
        <LessonDefinition>
          A stock exchange is a regulated marketplace where financial instruments like stocks, bonds, commodities, and derivatives are bought and sold. It serves as a platform for buyers and sellers to trade financial assets in an orderly manner.
        </LessonDefinition>
        <LessonKeyPoints>
          <LessonKeyPoint><strong>Facilitate Trading:</strong> Provides a structured environment for transactions.</LessonKeyPoint>
          <LessonKeyPoint><strong>Price Discovery:</strong> Determines stock prices based on supply and demand.</LessonKeyPoint>
          <LessonKeyPoint><strong>Liquidity:</strong> Ensures quick and transparent buying and selling.</LessonKeyPoint>
          <LessonKeyPoint><strong>Regulation and Transparency:</strong> Enforces rules for fair trading.</LessonKeyPoint>
        </LessonKeyPoints>
      </LessonSection>
      
      <ModuleHeader>Module 2: Major Stock Exchanges</ModuleHeader>
      <LessonSection>
        <LessonTitle>Lesson 1: New York Stock Exchange (NYSE)</LessonTitle>
        <LessonObjective>
          Objective: Learn about the NYSE and its role in global financial markets.
        </LessonObjective>
        <LessonDefinition>
          Founded in 1792, the NYSE is one of the oldest and largest stock exchanges in the world, based in New York City, USA. It is a physical exchange, also known as an auction market.
        </LessonDefinition>
        <LessonKeyPoints>
          <LessonKeyPoint><strong>Listed Companies:</strong> Home to over 2,800 companies.</LessonKeyPoint>
          <LessonKeyPoint><strong>Auction Market:</strong> Uses an auction-based system on the trading floor.</LessonKeyPoint>
          <LessonKeyPoint><strong>Specialists:</strong> Facilitate trades and maintain orderly trading.</LessonKeyPoint>
          <LessonKeyPoint><strong>Market Capitalization:</strong> One of the largest globally by market cap.</LessonKeyPoint>
        </LessonKeyPoints>
        <LessonDefinition>
          <strong>Trading Hours:</strong> 9:30 AM to 4:00 PM EST, Monday through Friday (except holidays).
        </LessonDefinition>
        <LessonDefinition>
          <strong>Trading Mechanism:</strong> Historically used open outcry; now mostly electronic.
        </LessonDefinition>
      </LessonSection>
      
      <LessonSection>
        <LessonTitle>Lesson 2: NASDAQ</LessonTitle>
        <LessonObjective>
          Objective: Understand the role of NASDAQ and how it differs from traditional exchanges like the NYSE.
        </LessonObjective>
        <LessonDefinition>
          NASDAQ, founded in 1971, is the first electronic stock exchange based in New York City, USA, with no physical trading floor.
        </LessonDefinition>
        <LessonKeyPoints>
          <LessonKeyPoint><strong>Tech-Focused:</strong> Lists many technology and internet-based companies.</LessonKeyPoint>
          <LessonKeyPoint><strong>Market Maker System:</strong> Operates on a market maker system providing liquidity.</LessonKeyPoint>
          <LessonKeyPoint><strong>Electronic Trading:</strong> All trades are executed electronically.</LessonKeyPoint>
        </LessonKeyPoints>
        <LessonDefinition>
          <strong>Trading Hours:</strong> 9:30 AM to 4:00 PM EST, Monday through Friday (except holidays).
        </LessonDefinition>
        <LessonDefinition>
          <strong>Trading Mechanism:</strong> Automated execution through its electronic system.
        </LessonDefinition>
      </LessonSection>
      
      <LessonSection>
        <LessonTitle>Lesson 3: London Stock Exchange (LSE)</LessonTitle>
        <LessonObjective>
          Objective: Explore the London Stock Exchange and its significance in global financial markets.
        </LessonObjective>
        <LessonDefinition>
          Established in 1801, the LSE is one of the oldest stock exchanges, based in London, United Kingdom. It is a hybrid exchange combining electronic and physical trading.
        </LessonDefinition>
        <LessonKeyPoints>
          <LessonKeyPoint><strong>Listed Companies:</strong> Over 2,000 companies including multinationals and smaller firms.</LessonKeyPoint>
          <LessonKeyPoint><strong>Main Market and AIM:</strong> Offers markets for large companies and smaller, high-growth companies.</LessonKeyPoint>
          <LessonKeyPoint><strong>Order-Driven Market:</strong> Trades executed based on buyers' and sellers' prices.</LessonKeyPoint>
        </LessonKeyPoints>
        <LessonDefinition>
          <strong>Trading Hours:</strong> 8:00 AM to 4:30 PM GMT, Monday through Friday (except holidays).
        </LessonDefinition>
        <LessonDefinition>
          <strong>Trading Mechanism:</strong> Combines electronic trading with periodic auction systems.
        </LessonDefinition>
      </LessonSection>
      
      <ModuleHeader>Module 3: How Stock Exchanges Facilitate Trading</ModuleHeader>
      <LessonSection>
        <LessonTitle>Lesson 1: The Trading Process</LessonTitle>
        <LessonObjective>
          Objective: Understand the basic process of trading on a stock exchange.
        </LessonObjective>
        <LessonKeyPoints>
          <LessonKeyPoint><strong>Placing an Order:</strong> Investors place orders via brokers (limit or market orders).</LessonKeyPoint>
          <LessonKeyPoint><strong>Order Routing:</strong> Brokers send orders to the appropriate exchange.</LessonKeyPoint>
          <LessonKeyPoint><strong>Matching Orders:</strong> Orders are matched (via specialists on NYSE or electronically on NASDAQ).</LessonKeyPoint>
          <LessonKeyPoint><strong>Execution and Settlement:</strong> Transactions are executed and settled (typically within two days, T+2).</LessonKeyPoint>
        </LessonKeyPoints>
      </LessonSection>
      
      <LessonSection>
        <LessonTitle>Lesson 2: Market Makers and Specialists</LessonTitle>
        <LessonObjective>
          Objective: Learn about the roles of market makers and specialists.
        </LessonObjective>
        <LessonDefinition>
          <strong>Market Makers:</strong> Firms or individuals that provide liquidity by buying and selling stocks at specified prices.
        </LessonDefinition>
        <LessonDefinition>
          <strong>Role:</strong> Ensure liquidity and smooth trading by maintaining buy and sell prices.
        </LessonDefinition>
        <LessonDefinition>
          <strong>Specialists:</strong> Individuals on the NYSE who facilitate trades for specific stocks and maintain order.
        </LessonDefinition>
      </LessonSection>
      
      <ModuleHeader>Module 4: Stock Exchange Regulation</ModuleHeader>
      <LessonSection>
        <LessonTitle>Lesson 1: Exchange Regulations and Oversight</LessonTitle>
        <LessonObjective>
          Objective: Understand the regulatory environment of stock exchanges.
        </LessonObjective>
        <LessonDefinition>
          Stock exchanges are regulated to ensure fairness, transparency, and to prevent market manipulation.
        </LessonDefinition>
        <LessonKeyPoints>
          <LessonKeyPoint><strong>Regulatory Bodies:</strong> SEC in the U.S. and FCA in the U.K. oversee exchanges.</LessonKeyPoint>
          <LessonKeyPoint><strong>Compliance and Reporting:</strong> Listed companies must adhere to strict financial reporting and disclosure requirements.</LessonKeyPoint>
        </LessonKeyPoints>
      </LessonSection>
      
      <QuizSection>
        <QuizHeader>Quiz: How Stock Exchanges Work</QuizHeader>
        <StockExchangesQuiz />
      </QuizSection>
      
      <EnrollButton onClick={() => { onMarkUnitComplete(course.id, unitIndex); onBack(); }}>
        Mark Topic Complete
      </EnrollButton>
    </CourseContentContainer>
  );
};

const StockExchangesQuiz = () => {
  const quizData = [
    {
      question: "1. Which of the following stock exchanges operates with a physical trading floor and an auction market?",
      options: [
        { value: 'a', text: "NASDAQ" },
        { value: 'b', text: "NYSE" },
        { value: 'c', text: "LSE" },
        { value: 'd', text: "Both b and c" },
      ],
      correctAnswer: 'b',
    },
    {
      question: "2. What is a key difference between NASDAQ and the NYSE?",
      options: [
        { value: 'a', text: "NASDAQ uses an auction-based system, while the NYSE uses market makers." },
        { value: 'b', text: "NASDAQ is an electronic exchange, while the NYSE is a hybrid exchange." },
        { value: 'c', text: "NASDAQ lists more tech companies than the NYSE." },
        { value: 'd', text: "Both b and c" },
      ],
      correctAnswer: 'd',
    },
    {
      question: "3. What is the primary function of market makers?",
      options: [
        { value: 'a', text: "To buy and sell stocks on behalf of individual investors" },
        { value: 'b', text: "To ensure liquidity and smooth trading by providing buy and sell prices" },
        { value: 'c', text: "To maintain the trading floor of an exchange" },
        { value: 'd', text: "To create new stocks for public trading" },
      ],
      correctAnswer: 'b',
    },
    {
      question: "4. How does a stock exchange ensure fair and transparent trading?",
      options: [
        { value: 'a', text: "By allowing anyone to trade without oversight" },
        { value: 'b', text: "By enforcing regulations and ensuring companies disclose financial information" },
        { value: 'c', text: "By limiting trading hours to specific periods" },
        { value: 'd', text: "By controlling the prices of stocks" },
      ],
      correctAnswer: 'b',
    },
    {
      question: "5. Which of the following is true about the LSE?",
      options: [
        { value: 'a', text: "It only trades stocks of large multinational corporations." },
        { value: 'b', text: "It operates purely electronically." },
        { value: 'c', text: "It has both a Main Market and an Alternative Investment Market (AIM) for smaller companies." },
        { value: 'd', text: "It only lists companies from the European Union." },
      ],
      correctAnswer: 'c',
    },
  ];

  const [selectedAnswers, setSelectedAnswers] = useState({});

  const handleOptionChange = (qIndex, value) => {
    if (selectedAnswers[qIndex] !== undefined) return;
    setSelectedAnswers(prev => ({ ...prev, [qIndex]: value }));
  };

  const getOptionStyle = (qIndex, optionValue, correctAnswer) => {
    const selected = selectedAnswers[qIndex];
    const baseStyle = {};
    if (selected === undefined) return baseStyle;
    if (optionValue === selected) {
      if (selected === correctAnswer) {
        return { backgroundColor: '#d4edda', borderColor: 'green', color: 'green' };
      } else {
        return { backgroundColor: '#f8d7da', borderColor: 'red', color: 'red' };
      }
    } else if (selected !== correctAnswer && optionValue === correctAnswer) {
      return { backgroundColor: '#d4edda', borderColor: 'green', color: 'green' };
    }
    return baseStyle;
  };

  return (
    <div>
      {quizData.map((q, qIndex) => (
        <QuestionContainer key={qIndex}>
          <p style={{ color: '#fff', fontWeight: 'bold' }}>{q.question}</p>
          {q.options.map(option => (
            <OptionContainer
              key={option.value}
              style={getOptionStyle(qIndex, option.value, q.correctAnswer)}
              onClick={() => handleOptionChange(qIndex, option.value)}
            >
              <input
                type="radio"
                name={`question-${qIndex}`}
                value={option.value}
                checked={selectedAnswers[qIndex] === option.value}
                onChange={() => handleOptionChange(qIndex, option.value)}
                style={{ marginRight: '10px' }}
                disabled={selectedAnswers[qIndex] !== undefined}
              />
              <label>{option.value}) {option.text}</label>
            </OptionContainer>
          ))}
        </QuestionContainer>
      ))}
    </div>
  );
};

// Types of stocks content
const TypesOfStocksContent = ({ course, unitIndex, onMarkUnitComplete, onBack }) => {
  return (
    <CourseContentContainer>
      <BackButton onClick={onBack}>Back to Topics</BackButton>
      
      <ModuleHeader>Module 1: Introduction to Stocks</ModuleHeader>
      <LessonSection>
        <LessonTitle>Lesson 1: What Are Stocks?</LessonTitle>
        <LessonObjective>
          Objective: Understand the concept of stocks and the two main types: common and preferred.
        </LessonObjective>
        <LessonDefinition>
          Definition: A stock (also known as a share or equity) represents ownership in a company. When you purchase a stock, you buy a piece of the company and gain a claim on part of its assets and earnings.
        </LessonDefinition>
        <LessonKeyPoints>
          <LessonKeyPoint><strong>Ownership:</strong> Owning stock means owning part of a company, allowing you to benefit from its growth, profits, and possibly influence its decisions.</LessonKeyPoint>
          <LessonKeyPoint><strong>Returns:</strong> Shareholders earn through capital gains and dividends.</LessonKeyPoint>
          <LessonKeyPoint><strong>Types of Stocks:</strong> There are two primary types: Common Stocks and Preferred Stocks.</LessonKeyPoint>
        </LessonKeyPoints>
      </LessonSection>
    
      <ModuleHeader>Module 2: Common Stocks</ModuleHeader>
      <LessonSection>
        <LessonTitle>Lesson 1: Overview of Common Stocks</LessonTitle>
        <LessonObjective>
          Objective: Learn the key characteristics of common stocks.
        </LessonObjective>
        <LessonDefinition>
          Definition: Common stocks are the most commonly held type of stock. When you buy common stock, you’re buying a share of ownership in the company, with potential dividends and voting rights.
        </LessonDefinition>
        <LessonKeyPoints>
          <LessonKeyPoint><strong>Voting Rights:</strong> Common stockholders typically have the right to vote on company matters.</LessonKeyPoint>
          <LessonKeyPoint><strong>Dividends:</strong> Dividends may be paid from profits, though they are not guaranteed.</LessonKeyPoint>
          <LessonKeyPoint><strong>Capital Gains:</strong> Profit is possible if the stock price increases.</LessonKeyPoint>
          <LessonKeyPoint><strong>Risk:</strong> In case of bankruptcy, common stockholders are last in line for payouts.</LessonKeyPoint>
          <LessonKeyPoint><strong>Liquidity:</strong> Common stocks are usually highly liquid.
          </LessonKeyPoint>
        </LessonKeyPoints>
      </LessonSection>
   
      <ModuleHeader>Module 3: Preferred Stocks</ModuleHeader>
      <LessonSection>
        <LessonTitle>Lesson 1: Overview of Preferred Stocks</LessonTitle>
        <LessonObjective>
          Objective: Understand the unique characteristics of preferred stocks and how they differ from common stocks.
        </LessonObjective>
        <LessonDefinition>
          Definition: Preferred stocks give shareholders priority in dividend payments and asset claims during liquidation, but usually lack voting rights.
        </LessonDefinition>
        <LessonKeyPoints>
          <LessonKeyPoint><strong>Priority Dividends:</strong> Fixed dividends are typically paid before those of common stockholders.</LessonKeyPoint>
          <LessonKeyPoint><strong>No Voting Rights:</strong> Preferred stockholders usually do not have voting rights.</LessonKeyPoint>
          <LessonKeyPoint><strong>Liquidation Preference:</strong> They have a higher claim on assets than common stockholders in liquidation.</LessonKeyPoint>
          <LessonKeyPoint><strong>Convertible/Callable Features:</strong> Some preferred stocks can be converted to common stock or may be callable.
          </LessonKeyPoint>
        </LessonKeyPoints>
      </LessonSection>

      <ModuleHeader>Module 4: Key Differences Between Common and Preferred Stocks</ModuleHeader>
      <LessonSection>
        <LessonTitle>Lesson 1: Comparing Common and Preferred Stocks</LessonTitle>
        <LessonKeyPoints>
          <LessonKeyPoint><strong>Ownership:</strong> Both represent ownership, but common stockholders have more influence due to voting rights.</LessonKeyPoint>
          <LessonKeyPoint><strong>Dividends:</strong> Common stocks have variable dividends; preferred stocks have fixed dividends paid before common.</LessonKeyPoint>
          <LessonKeyPoint><strong>Risk in Liquidation:</strong> Common stockholders are paid last; preferred stockholders have priority over common.</LessonKeyPoint>
          <LessonKeyPoint><strong>Capital Gains:</strong> Common stocks offer higher potential for capital gains, with increased risk.</LessonKeyPoint>
          <LessonKeyPoint><strong>Voting Rights:</strong> Common stocks usually include voting rights; preferred stocks typically do not.</LessonKeyPoint>
        </LessonKeyPoints>
      </LessonSection>
   
      <ModuleHeader>Module 5: Which Stock is Right for You?</ModuleHeader>
      <LessonSection>
        <LessonTitle>Lesson 1: Choosing Between Common and Preferred Stocks</LessonTitle>
        <LessonObjective>
          Objective: Understand which type of stock is better suited to different investor profiles.
        </LessonObjective>
        <LessonDefinition>
          When to Choose Common Stocks: Ideal for growth-oriented and active investors who seek capital appreciation and desire voting rights.
        </LessonDefinition>
        <LessonDefinition>
          When to Choose Preferred Stocks: Suitable for income-focused and risk-averse investors who prefer stable, predictable dividends.
        </LessonDefinition>
      </LessonSection>
   
      <QuizSection>
        <QuizHeader>Quiz: Types of Stocks (Common vs. Preferred)</QuizHeader>
        <TypesOfStocksQuiz />
      </QuizSection>
      
      <EnrollButton onClick={() => { onMarkUnitComplete(course.id, unitIndex); onBack(); }}>
        Mark Topic Complete
      </EnrollButton>
    </CourseContentContainer>
  );
};

const TypesOfStocksQuiz = () => {
  const quizData = [
    {
      question: "1. Which type of stock provides voting rights to its shareholders?",
      options: [
        { value: 'a', text: "Preferred Stocks" },
        { value: 'b', text: "Common Stocks" },
        { value: 'c', text: "Both Common and Preferred Stocks" },
        { value: 'd', text: "Neither Common nor Preferred Stocks" },
      ],
      correctAnswer: 'b',
    },
    {
      question: "2. Which of the following is true about preferred stocks?",
      options: [
        { value: 'a', text: "They provide high potential for capital appreciation." },
        { value: 'b', text: "They are typically paid after common stockholders in case of liquidation." },
        { value: 'c', text: "They have a fixed dividend, paid before common stockholders." },
        { value: 'd', text: "Preferred stockholders have voting rights on company matters." },
      ],
      correctAnswer: 'c',
    },
    {
      question: "3. In the event of a company liquidation, who gets paid first?",
      options: [
        { value: 'a', text: "Common stockholders" },
        { value: 'b', text: "Preferred stockholders" },
        { value: 'c', text: "Bondholders" },
        { value: 'd', text: "Both preferred and common stockholders get paid equally" },
      ],
      correctAnswer: 'c',
    },
    {
      question: "4. What is a major disadvantage of preferred stocks compared to common stocks?",
      options: [
        { value: 'a', text: "Limited potential for capital gains" },
        { value: 'b', text: "Higher risk in case of liquidation" },
        { value: 'c', text: "No dividends are paid" },
        { value: 'd', text: "Increased voting rights" },
      ],
      correctAnswer: 'a',
    },
    {
      question: "5. What type of investors would typically prefer preferred stocks?",
      options: [
        { value: 'a', text: "Investors looking for growth and high capital appreciation" },
        { value: 'b', text: "Income-focused investors who seek steady, predictable dividends" },
        { value: 'c', text: "Investors looking for voting rights and influence in company decisions" },
        { value: 'd', text: "Investors who want high volatility and short-term gains" },
      ],
      correctAnswer: 'b',
    },
  ];

  const [selectedAnswers, setSelectedAnswers] = useState({});

  const handleOptionChange = (qIndex, value) => {
    if (selectedAnswers[qIndex] !== undefined) return;
    setSelectedAnswers(prev => ({ ...prev, [qIndex]: value }));
  };

  const getOptionStyle = (qIndex, optionValue, correctAnswer) => {
    const selected = selectedAnswers[qIndex];
    const baseStyle = {};
    if (selected === undefined) return baseStyle;
    if (optionValue === selected) {
      if (selected === correctAnswer) {
        return { backgroundColor: '#d4edda', borderColor: 'green', color: 'green' };
      } else {
        return { backgroundColor: '#f8d7da', borderColor: 'red', color: 'red' };
      }
    } else if (selected !== correctAnswer && optionValue === correctAnswer) {
      return { backgroundColor: '#d4edda', borderColor: 'green', color: 'green' };
    }
    return baseStyle;
  };

  return (
    <div>
      {quizData.map((q, qIndex) => (
        <QuestionContainer key={qIndex}>
          <p style={{ color: '#fff', fontWeight: 'bold' }}>{q.question}</p>
          {q.options.map(option => (
            <OptionContainer
              key={option.value}
              style={getOptionStyle(qIndex, option.value, q.correctAnswer)}
              onClick={() => handleOptionChange(qIndex, option.value)}
            >
              <input
                type="radio"
                name={`question-${qIndex}`}
                value={option.value}
                checked={selectedAnswers[qIndex] === option.value}
                onChange={() => handleOptionChange(qIndex, option.value)}
                style={{ marginRight: '10px' }}
                disabled={selectedAnswers[qIndex] !== undefined}
              />
              <label>{option.value}) {option.text}</label>
            </OptionContainer>
          ))}
        </QuestionContainer>
      ))}
    </div>
  );
};

// Financial statement content
const FinancialStatementsContent = ({ course, unitIndex, onMarkUnitComplete, onBack }) => {
  return (
    <CourseContentContainer>
      <BackButton onClick={onBack}>Back to Topics</BackButton>
      
      <ModuleHeader>Module 1: Introduction to Financial Statements</ModuleHeader>
      <LessonSection>
        <LessonTitle>Lesson 1: What Are Financial Statements?</LessonTitle>
        <LessonObjective>
          Objective: Understand the role and importance of financial statements.
        </LessonObjective>
        <LessonDefinition>
          Financial statements are vital tools for understanding the financial performance and position of a business. They provide detailed insights into how a company is performing financially, helping investors, managers, and stakeholders make informed decisions.
        </LessonDefinition>
        <LessonDefinition>
          There are three key financial statements: the Balance Sheet, the Income Statement, and the Cash Flow Statement.
        </LessonDefinition>
        <LessonDefinition>
          Each statement serves a different purpose. The balance sheet offers a snapshot of a company’s financial position at a given point in time, outlining its assets, liabilities, and equity. The income statement focuses on the company’s performance over a period, revealing revenues, expenses, and profits or losses. The cash flow statement shows how the company generates and spends cash, which is crucial for understanding its liquidity.
        </LessonDefinition>
        <LessonDefinition>
          Understanding these statements is essential for assessing a company’s profitability, solvency, and liquidity.
        </LessonDefinition>
      </LessonSection>
      
      <ModuleHeader>Module 2: The Balance Sheet</ModuleHeader>
      <LessonSection>
        <LessonTitle>Lesson 1: Understanding the Balance Sheet</LessonTitle>
        <LessonObjective>
          Objective: Learn how to interpret a balance sheet.
        </LessonObjective>
        <LessonDefinition>
          The balance sheet provides a snapshot of a company’s financial standing at a specific point in time, structured around the equation: Assets = Liabilities + Equity.
        </LessonDefinition>
        <LessonDefinition>
          The assets section outlines what the company owns, divided into current assets (expected to convert to cash within one year) and non-current assets (long-term investments, property, etc.).
        </LessonDefinition>
        <LessonDefinition>
          The liabilities section lists the company’s obligations, classified as current liabilities and non-current liabilities.
        </LessonDefinition>
        <LessonDefinition>
          Equity represents the owner’s claim after liabilities are settled, including shareholders’ equity and retained earnings.
        </LessonDefinition>
        <LessonDefinition>
          The balance sheet is a key tool for assessing a company’s solvency and overall financial stability.
        </LessonDefinition>
      </LessonSection>
      
      <ModuleHeader>Module 3: The Income Statement</ModuleHeader>
      <LessonSection>
        <LessonTitle>Lesson 1: Understanding the Income Statement</LessonTitle>
        <LessonObjective>
          Objective: Learn how to read an income statement.
        </LessonObjective>
        <LessonDefinition>
          The income statement, also known as the profit and loss statement, summarizes a company’s revenues, expenses, and profits or losses over a specific period.
        </LessonDefinition>
        <LessonDefinition>
          It begins with revenue or sales, then deducts the cost of goods sold (COGS) to arrive at gross profit.
        </LessonDefinition>
        <LessonDefinition>
          Operating expenses, such as selling, general, and administrative (SG&A) expenses, are subtracted to determine operating income (EBIT), and after accounting for interest and taxes, net income is calculated.
        </LessonDefinition>
        <LessonDefinition>
          This statement is critical for evaluating a company’s operational efficiency and overall profitability.
        </LessonDefinition>
      </LessonSection>
      
      <ModuleHeader>Module 4: The Cash Flow Statement</ModuleHeader>
      <LessonSection>
        <LessonTitle>Lesson 1: Understanding the Cash Flow Statement</LessonTitle>
        <LessonObjective>
          Objective: Understand the importance of cash flow in assessing a company's liquidity.
        </LessonObjective>
        <LessonDefinition>
          The cash flow statement details a company’s cash inflows and outflows over a period, focusing solely on actual cash movement.
        </LessonDefinition>
        <LessonDefinition>
          It is divided into operating activities, investing activities, and financing activities. Operating activities show cash from core business operations; investing activities reflect cash used for long-term asset transactions; and financing activities cover transactions related to debt and equity.
        </LessonDefinition>
        <LessonDefinition>
          Free cash flow—calculated as operating cash flow minus capital expenditures—indicates the company’s ability to fund growth, repay debt, or return cash to shareholders.
        </LessonDefinition>
      </LessonSection>
      
      <ModuleHeader>Module 5: Analyzing the Financial Statements</ModuleHeader>
      <LessonSection>
        <LessonTitle>Lesson 1: Financial Ratios and What They Mean</LessonTitle>
        <LessonObjective>
          Objective: Learn to use financial ratios to assess a company’s performance.
        </LessonObjective>
        <LessonDefinition>
          Financial ratios help evaluate various aspects of a company’s performance. Liquidity ratios, such as the current ratio, assess a company’s ability to meet short-term obligations.
        </LessonDefinition>
        <LessonDefinition>
          Profitability ratios, like gross profit margin and net profit margin, measure how efficiently a company generates profit from its revenues.
        </LessonDefinition>
        <LessonDefinition>
          Leverage ratios, including the debt-to-equity ratio, indicate the extent of a company’s financing through debt.
        </LessonDefinition>
        <LessonDefinition>
          Efficiency ratios, like the inventory turnover ratio, show how effectively a company utilizes its assets.
        </LessonDefinition>
      </LessonSection>
      
      <QuizSection>
        <QuizHeader>Quiz: How to Read Financial Statements</QuizHeader>
        <FinancialStatementsQuiz />
      </QuizSection>
      
      <EnrollButton onClick={() => { onMarkUnitComplete(course.id, unitIndex); onBack(); }}>
        Mark Topic Complete
      </EnrollButton>
    </CourseContentContainer>
  );
};

const FinancialStatementsQuiz = () => {
  const quizData = [
    {
      question: "Which of the following is not a key financial statement?",
      options: [
        { value: 'a', text: "Balance Sheet" },
        { value: 'b', text: "Income Statement" },
        { value: 'c', text: "Cash Flow Statement" },
        { value: 'd', text: "Marketing Statement" },
      ],
      correctAnswer: 'd',
    },
    {
      question: "The balance sheet equation is:",
      options: [
        { value: 'a', text: "Assets = Liabilities + Revenue" },
        { value: 'b', text: "Assets = Liabilities + Equity" },
        { value: 'c', text: "Assets = Expenses + Equity" },
        { value: 'd', text: "Revenue = Assets + Equity" },
      ],
      correctAnswer: 'b',
    },
    {
      question: "Which of the following is included in operating activities on the cash flow statement?",
      options: [
        { value: 'a', text: "Buying equipment" },
        { value: 'b', text: "Selling long-term investments" },
        { value: 'c', text: "Payments to suppliers" },
        { value: 'd', text: "Issuing stock" },
      ],
      correctAnswer: 'c',
    },
    {
      question: "Which financial statement provides a snapshot of a company’s financial position at a specific point in time?",
      options: [
        { value: 'a', text: "Income Statement" },
        { value: 'b', text: "Cash Flow Statement" },
        { value: 'c', text: "Balance Sheet" },
        { value: 'd', text: "Profit and Loss Statement" },
      ],
      correctAnswer: 'c',
    },
    {
      question: "Which ratio is used to assess a company’s ability to meet its short-term obligations?",
      options: [
        { value: 'a', text: "Current Ratio" },
        { value: 'b', text: "Gross Profit Margin" },
        { value: 'c', text: "Debt-to-Equity Ratio" },
        { value: 'd', text: "Return on Equity (ROE)" },
      ],
      correctAnswer: 'a',
    },
  ];

  const [selectedAnswers, setSelectedAnswers] = useState({});

  const handleOptionChange = (qIndex, value) => {
    if (selectedAnswers[qIndex] !== undefined) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: value }));
  };

  const getOptionStyle = (qIndex, optionValue, correctAnswer) => {
    const selected = selectedAnswers[qIndex];
    const baseStyle = {};
    if (selected === undefined) return baseStyle;
    if (optionValue === selected) {
      if (selected === correctAnswer) {
        return { backgroundColor: '#d4edda', borderColor: 'green', color: 'green' };
      } else {
        return { backgroundColor: '#f8d7da', borderColor: 'red', color: 'red' };
      }
    } else if (selected !== correctAnswer && optionValue === correctAnswer) {
      return { backgroundColor: '#d4edda', borderColor: 'green', color: 'green' };
    }
    return baseStyle;
  };

  return (
    <div>
      {quizData.map((q, qIndex) => (
        <QuestionContainer key={qIndex}>
          <p style={{ color: '#fff', fontWeight: 'bold' }}>{q.question}</p>
          {q.options.map(option => (
            <OptionContainer
              key={option.value}
              style={getOptionStyle(qIndex, option.value, q.correctAnswer)}
              onClick={() => handleOptionChange(qIndex, option.value)}
            >
              <input
                type="radio"
                name={`financial-statement-question-${qIndex}`}
                value={option.value}
                checked={selectedAnswers[qIndex] === option.value}
                onChange={() => handleOptionChange(qIndex, option.value)}
                style={{ marginRight: '10px' }}
                disabled={selectedAnswers[qIndex] !== undefined}
              />
              <label>{option.value}) {option.text}</label>
            </OptionContainer>
          ))}
        </QuestionContainer>
      ))}
    </div>
  );
};

const ValuationMetricsContent = ({ course, unitIndex, onMarkUnitComplete, onBack }) => {
  return (
    <CourseContentContainer>
      <BackButton onClick={onBack}>Back to Topics</BackButton>
      
      <ModuleHeader>Module 1: Introduction to Valuation Metrics</ModuleHeader>
      <LessonSection>
        <LessonTitle>Lesson 1: What are Valuation Metrics?</LessonTitle>
        <LessonObjective>
          Objective: Understand the concept and importance of valuation metrics.
        </LessonObjective>
        <LessonDefinition>
          Valuation metrics are crucial tools used to evaluate the financial performance and market value of a company. They help investors decide whether a company is overvalued or undervalued.
        </LessonDefinition>
        <LessonDefinition>
          These metrics are usually expressed as ratios derived from financial statements (such as earnings, revenue, and equity). Common examples include the Price-to-Earnings (P/E) ratio, Earnings Per Share (EPS), and Return on Equity (ROE).
        </LessonDefinition>
        <LessonDefinition>
          Using them together provides a comprehensive picture of a company’s financial health.
        </LessonDefinition>
        <LessonActivity>
          Activity: Take a publicly traded company of your choice and locate its P/E ratio, EPS, and ROE. Compare these metrics with a few other companies in the same industry and discuss your observations.
        </LessonActivity>
      </LessonSection>

      <ModuleHeader>Module 2: Price-to-Earnings (P/E) Ratio</ModuleHeader>
      <LessonSection>
        <LessonTitle>Lesson 1: Understanding the P/E Ratio</LessonTitle>
        <LessonObjective>
          Objective: Learn how the P/E ratio is used to value a company.
        </LessonObjective>
        <LessonDefinition>
          The P/E ratio is calculated as the Price per Share divided by Earnings per Share (EPS). A high P/E may indicate high growth expectations or overvaluation; a low P/E could indicate undervaluation or troubles.
        </LessonDefinition>
        <LessonDefinition>
          There are two types: Trailing P/E (using past earnings) and Forward P/E (using projected earnings).
        </LessonDefinition>
        <LessonActivity>
          Activity: Select a company from the tech industry and calculate its trailing and forward P/E ratios. Compare these to a company in the consumer goods sector.
        </LessonActivity>
      </LessonSection>

      <ModuleHeader>Module 3: Earnings Per Share (EPS)</ModuleHeader>
      <LessonSection>
        <LessonTitle>Lesson 1: Understanding Earnings Per Share (EPS)</LessonTitle>
        <LessonObjective>
          Objective: Understand EPS and its role in evaluating profitability.
        </LessonObjective>
        <LessonDefinition>
          EPS is calculated as (Net Income − Dividends on Preferred Stock) divided by Outstanding Shares. It shows how much profit is attributed to each share.
        </LessonDefinition>
        <LessonDefinition>
          There are two types: Basic EPS and Diluted EPS.
        </LessonDefinition>
        <LessonActivity>
          Activity: Choose a company and compute its basic and diluted EPS for the last quarter. Discuss any significant differences.
        </LessonActivity>
      </LessonSection>

      <ModuleHeader>Module 4: Return on Equity (ROE)</ModuleHeader>
      <LessonSection>
        <LessonTitle>Lesson 1: Understanding Return on Equity (ROE)</LessonTitle>
        <LessonObjective>
          Objective: Learn how ROE reflects a company’s efficiency.
        </LessonObjective>
        <LessonDefinition>
          ROE is calculated as Net Income divided by Shareholders’ Equity. A higher ROE means the company is generating more profit per unit of equity.
        </LessonDefinition>
        <LessonActivity>
          Activity: Calculate the ROE for a well-known company (e.g., Apple) and compare it with the industry average.
        </LessonActivity>
      </LessonSection>

      <ModuleHeader>Module 5: Other Valuation Metrics</ModuleHeader>
      <LessonSection>
        <LessonTitle>Lesson 1: Price-to-Book (P/B) Ratio and Dividend Yield</LessonTitle>
        <LessonObjective>
          Objective: Explore additional metrics for company valuation.
        </LessonObjective>
        <LessonDefinition>
          The P/B ratio compares the market price of a stock to its book value. Dividend yield shows the annual dividend relative to the stock price.
        </LessonDefinition>
        <LessonActivity>
          Activity: Research a company with a high dividend yield and compare its P/B ratio and dividend yield with its peers.
        </LessonActivity>
      </LessonSection>

      <QuizSection>
        <QuizHeader>Quiz: Understanding Valuation Metrics</QuizHeader>
        <ValuationMetricsQuiz />
      </QuizSection>

      <EnrollButton onClick={() => { onMarkUnitComplete(course.id, unitIndex); onBack(); }}>
        Mark Topic Complete
      </EnrollButton>
    </CourseContentContainer>
  );
};

const ValuationMetricsQuiz = () => {
  const quizData = [
    {
      question: "What does the P/E ratio measure?",
      options: [
        { value: 'a', text: "The amount of profit a company generates for each dollar of sales" },
        { value: 'b', text: "How much investors are willing to pay for each dollar of earnings" },
        { value: 'c', text: "The overall profitability of a company" },
        { value: 'd', text: "The company’s return on equity" },
      ],
      correctAnswer: 'b',
    },
    {
      question: "Which of the following indicates a high level of profitability relative to shareholders’ equity?",
      options: [
        { value: 'a', text: "A low P/E ratio" },
        { value: 'b', text: "A high ROE" },
        { value: 'c', text: "A high P/B ratio" },
        { value: 'd', text: "A low dividend yield" },
      ],
      correctAnswer: 'b',
    },
    {
      question: "What does a high P/B ratio typically indicate?",
      options: [
        { value: 'a', text: "The company is undervalued" },
        { value: 'b', text: "The company has a low market value relative to its assets" },
        { value: 'c', text: "The company’s stock price is high compared to its book value" },
        { value: 'd', text: "The company is experiencing poor financial performance" },
      ],
      correctAnswer: 'c',
    },
    {
      question: "Which metric is used to calculate the P/E ratio?",
      options: [
        { value: 'a', text: "Earnings Per Share (EPS)" },
        { value: 'b', text: "Return on Equity (ROE)" },
        { value: 'c', text: "Price-to-Book (P/B) ratio" },
        { value: 'd', text: "Free Cash Flow" },
      ],
      correctAnswer: 'a',
    },
    {
      question: "What is the Dividend Yield?",
      options: [
        { value: 'a', text: "The percentage of net income paid out as dividends" },
        { value: 'b', text: "The annual dividends per share divided by the stock price" },
        { value: 'c', text: "The ratio of market price to book value" },
        { value: 'd', text: "The profit margin from a company’s core operations" },
      ],
      correctAnswer: 'b',
    },
  ];

  const [selectedAnswers, setSelectedAnswers] = useState({});

  const handleOptionChange = (qIndex, value) => {
    if (selectedAnswers[qIndex] !== undefined) return;
    setSelectedAnswers(prev => ({ ...prev, [qIndex]: value }));
  };

  const getOptionStyle = (qIndex, optionValue, correctAnswer) => {
    const selected = selectedAnswers[qIndex];
    if (!selected) return {};
    if (optionValue === selected) {
      return selected === correctAnswer 
             ? { backgroundColor: '#d4edda', borderColor: 'green', color: 'green' } 
             : { backgroundColor: '#f8d7da', borderColor: 'red', color: 'red' };
    } else if (optionValue === correctAnswer) {
      return { backgroundColor: '#d4edda', borderColor: 'green', color: 'green' };
    }
    return {};
  };

  return (
    <div>
      {quizData.map((q, qIndex) => (
        <QuestionContainer key={qIndex}>
          <p style={{ color: '#fff', fontWeight: 'bold' }}>{q.question}</p>
          {q.options.map(option => (
            <OptionContainer
              key={option.value}
              style={getOptionStyle(qIndex, option.value, q.correctAnswer)}
              onClick={() => handleOptionChange(qIndex, option.value)}
            >
              <input
                type="radio"
                name={`valuation-question-${qIndex}`}
                value={option.value}
                checked={selectedAnswers[qIndex] === option.value}
                onChange={() => handleOptionChange(qIndex, option.value)}
                style={{ marginRight: '10px' }}
                disabled={selectedAnswers[qIndex] !== undefined}
              />
              <label>{option.value}) {option.text}</label>
            </OptionContainer>
          ))}
        </QuestionContainer>
      ))}
    </div>
  );
};
const EconomicIndustryAnalysisContent = ({ course, unitIndex, onMarkUnitComplete, onBack }) => {
  return (
    <CourseContentContainer>
      <BackButton onClick={onBack}>Back to Topics</BackButton>

      <ModuleHeader>Module 1: Introduction to Economic and Industry Analysis</ModuleHeader>
      <LessonSection>
        <LessonTitle>Lesson 1: What is Economic and Industry Analysis?</LessonTitle>
        <LessonObjective>
          Objective: Understand the process and importance of economic and industry analysis.
        </LessonObjective>
        <LessonDefinition>
          Economic and industry analysis is a critical process used by investors, analysts, and policymakers to assess the current and future performance of markets, industries, and the economy as a whole. It helps to understand how different economic factors impact industries and businesses, as well as how industries evolve in response to broader economic trends.
        </LessonDefinition>
        <LessonDefinition>
          Economic analysis involves evaluating macroeconomic indicators such as GDP growth, inflation rates, interest rates, and employment data. It also looks at how government policies, fiscal measures, and global economic events influence market conditions. Industry analysis, on the other hand, focuses on specific sectors of the economy, examining factors like competition, regulation, technological change, and consumer behavior.
        </LessonDefinition>
        <LessonDefinition>
          Together, economic and industry analysis provides a comprehensive understanding of how markets operate, the risks and opportunities within specific sectors, and the factors influencing investment decisions.
        </LessonDefinition>
        <LessonActivity>
          Activity: Choose an industry of interest (e.g., technology, healthcare, energy) and research current economic conditions (e.g., GDP growth, inflation) and how they may impact that industry. Write a short analysis of how economic conditions are shaping the performance and outlook of this industry.
        </LessonActivity>
      </LessonSection>

      <ModuleHeader>Module 2: Economic Analysis</ModuleHeader>
      <LessonSection>
        <LessonTitle>Lesson 1: Key Economic Indicators</LessonTitle>
        <LessonObjective>
          Objective: Understand the macroeconomic indicators used to assess an economy.
        </LessonObjective>
        <LessonDefinition>
          Economic analysis involves studying various macroeconomic indicators that provide insights into the overall health of an economy. Understanding these indicators helps businesses and investors make strategic decisions.
        </LessonDefinition>
        <LessonDefinition>
          <strong>Gross Domestic Product (GDP):</strong> GDP measures the total value of goods and services produced within a country over a specific period. A growing GDP indicates expansion, while a contracting GDP may signal recession.
        </LessonDefinition>
        <LessonDefinition>
          <strong>Inflation:</strong> Inflation measures the rate at which prices for goods and services rise, reducing purchasing power. High inflation can erode spending power, while low inflation may indicate weak demand.
        </LessonDefinition>
        <LessonDefinition>
          <strong>Unemployment Rate:</strong> This indicates the percentage of the labor force that is jobless but seeking work. A low rate signals strength; a high rate indicates economic stagnation.
        </LessonDefinition>
        <LessonDefinition>
          <strong>Interest Rates:</strong> Set by central banks, these affect borrowing costs. Higher rates can slow the economy; lower rates stimulate growth.
        </LessonDefinition>
        <LessonDefinition>
          <strong>Consumer Confidence Index (CCI):</strong> This measures consumer sentiment about future economic conditions.
        </LessonDefinition>
        <LessonActivity>
          Activity: Look up the latest GDP growth rate, inflation rate, and unemployment data for your country. Analyze how these indicators are affecting the economy and consider how they might influence specific industries in the short and long term.
        </LessonActivity>
      </LessonSection>
      
      <ModuleHeader>Module 3: Industry Analysis</ModuleHeader>
      <LessonSection>
        <LessonTitle>Lesson 1: Understanding Industry Analysis</LessonTitle>
        <LessonObjective>
          Objective: Learn how to analyze the dynamics within specific sectors of the economy.
        </LessonObjective>
        <LessonDefinition>
          Industry analysis focuses on understanding the dynamics within specific sectors. It examines factors such as competition, regulation, technological advancements, and consumer behavior that impact an industry’s performance.
        </LessonDefinition>
        <LessonDefinition>
          <strong>Industry Life Cycle:</strong> Every industry progresses through stages (introduction, growth, maturity, decline). Knowing the stage helps predict opportunities and risks.
        </LessonDefinition>
        <LessonDefinition>
          <strong>Competitive Environment:</strong> The number of competitors, barriers to entry, and market share distribution affect profitability.
        </LessonDefinition>
        <LessonDefinition>
          <strong>Technological Change and Innovation:</strong> Rapid technological advancements can drive growth or force companies to adapt.
        </LessonDefinition>
        <LessonDefinition>
          <strong>Regulatory Environment:</strong> Government regulations and policies can either hinder or enhance industry growth.
        </LessonDefinition>
        <LessonDefinition>
          <strong>Consumer Behavior and Trends:</strong> Shifts in consumer preferences can reshape industries.
        </LessonDefinition>
        <LessonActivity>
          Activity: Pick an industry (e.g., healthcare, automotive, energy) and analyze its life cycle stage, competition, and consumer trends. Write a brief report on your findings.
        </LessonActivity>
      </LessonSection>
  
      <ModuleHeader>Module 4: Industry-Specific Economic Factors</ModuleHeader>
      <LessonSection>
        <LessonTitle>Lesson 1: Key Factors Affecting Industry Performance</LessonTitle>
        <LessonObjective>
          Objective: Identify the economic factors that uniquely impact an industry.
        </LessonObjective>
        <LessonDefinition>
          Different industries are affected by specific economic factors. For example, supply chain dynamics are critical for manufacturing, while commodity prices greatly influence industries like oil and gas.
        </LessonDefinition>
        <LessonDefinition>
          <strong>Supply Chain Dynamics:</strong> Disruptions can increase costs and delay production.
        </LessonDefinition>
        <LessonDefinition>
          <strong>Commodity Prices:</strong> Fluctuations can dramatically affect profitability for industries reliant on raw materials.
        </LessonDefinition>
        <LessonDefinition>
          <strong>Global Economic Events:</strong> Events like pandemics, geopolitical tensions, or trade wars can alter market conditions.
        </LessonDefinition>
        <LessonDefinition>
          <strong>Interest Rate Sensitivity:</strong> Industries such as real estate are particularly sensitive to changes in borrowing costs.
        </LessonDefinition>
        <LessonActivity>
          Activity: Select an industry that depends on a specific commodity (e.g., oil for airlines) and analyze how fluctuations in its price have affected industry performance. Write a short analysis.
        </LessonActivity>
      </LessonSection>
 
      <ModuleHeader>Module 5: Integrating Economic and Industry Analysis</ModuleHeader>
      <LessonSection>
        <LessonTitle>Lesson 1: Combining Economic and Industry Analysis for Investment Decisions</LessonTitle>
        <LessonObjective>
          Objective: Learn to merge economic and industry analysis for better investment insights.
        </LessonObjective>
        <LessonDefinition>
          Combining macroeconomic indicators with industry-specific factors helps investors identify sectors likely to perform well under current conditions. For example, low-interest rates might benefit real estate, while high inflation might favor energy companies.
        </LessonDefinition>
        <LessonDefinition>
          An integrated approach helps pinpoint both risks and opportunities, ensuring more informed investment decisions.
        </LessonDefinition>
        <LessonActivity>
          Activity: Research current economic conditions (interest rates, inflation, GDP growth) and analyze how these factors could impact a specific industry. Write a report on your analysis.
        </LessonActivity>
      </LessonSection>

      <QuizSection>
        <QuizHeader>Quiz: Economic and Industry Analysis</QuizHeader>
        <EconomicIndustryAnalysisQuiz />
      </QuizSection>

      <EnrollButton onClick={() => { onMarkUnitComplete(course.id, unitIndex); onBack(); }}>
        Mark Topic Complete
      </EnrollButton>
    </CourseContentContainer>
  );
};
const EconomicIndustryAnalysisQuiz = () => {
  const quizData = [
    {
      question: "Which of the following economic indicators measures the total value of goods and services produced within a country?",
      options: [
        { value: 'a', text: "GDP" },
        { value: 'b', text: "Inflation" },
        { value: 'c', text: "Unemployment rate" },
        { value: 'd', text: "Consumer Confidence Index" },
      ],
      correctAnswer: 'a',
    },
    {
      question: "In which stage of the industry life cycle would you expect a company to experience rapid growth and expansion?",
      options: [
        { value: 'a', text: "Introduction" },
        { value: 'b', text: "Growth" },
        { value: 'c', text: "Maturity" },
        { value: 'd', text: "Decline" },
      ],
      correctAnswer: 'b',
    },
    {
      question: "What does the Consumer Confidence Index (CCI) measure?",
      options: [
        { value: 'a', text: "The number of jobs available in the economy" },
        { value: 'b', text: "The level of consumer optimism about future economic conditions" },
        { value: 'c', text: "The average inflation rate" },
        { value: 'd', text: "The growth rate of GDP" },
      ],
      correctAnswer: 'b',
    },
    {
      question: "How do interest rates primarily impact capital-intensive industries?",
      options: [
        { value: 'a', text: "By increasing consumer demand for goods" },
        { value: 'b', text: "By affecting borrowing costs for companies investing in large projects" },
        { value: 'c', text: "By raising the price of raw materials" },
        { value: 'd', text: "By decreasing the level of competition within the industry" },
      ],
      correctAnswer: 'b',
    },
    {
      question: "Which factor would likely have the most significant impact on the profitability of a company in the oil and gas industry?",
      options: [
        { value: 'a', text: "Changes in interest rates" },
        { value: 'b', text: "Fluctuations in commodity prices" },
        { value: 'c', text: "Technological innovations in renewable energy" },
        { value: 'd', text: "Changes in consumer behavior" },
      ],
      correctAnswer: 'b',
    },
  ];

  const [selectedAnswers, setSelectedAnswers] = useState({});

  const handleOptionChange = (qIndex, value) => {
    if (selectedAnswers[qIndex] !== undefined) return;
    setSelectedAnswers(prev => ({ ...prev, [qIndex]: value }));
  };

  const getOptionStyle = (qIndex, optionValue, correctAnswer) => {
    const selected = selectedAnswers[qIndex];
    if (!selected) return {};
    if (optionValue === selected) {
      return selected === correctAnswer 
             ? { backgroundColor: '#d4edda', borderColor: 'green', color: 'green' } 
             : { backgroundColor: '#f8d7da', borderColor: 'red', color: 'red' };
    } else if (optionValue === correctAnswer) {
      return { backgroundColor: '#d4edda', borderColor: 'green', color: 'green' };
    }
    return {};
  };

  return (
    <div>
      {quizData.map((q, qIndex) => (
        <QuestionContainer key={qIndex}>
          <p style={{ color: '#fff', fontWeight: 'bold' }}>{q.question}</p>
          {q.options.map(option => (
            <OptionContainer
              key={option.value}
              style={getOptionStyle(qIndex, option.value, q.correctAnswer)}
              onClick={() => handleOptionChange(qIndex, option.value)}
            >
              <input
                type="radio"
                name={`economic-industry-question-${qIndex}`}
                value={option.value}
                checked={selectedAnswers[qIndex] === option.value}
                onChange={() => handleOptionChange(qIndex, option.value)}
                style={{ marginRight: '10px' }}
                disabled={selectedAnswers[qIndex] !== undefined}
              />
              <label>{option.value}) {option.text}</label>
            </OptionContainer>
          ))}
        </QuestionContainer>
      ))}
    </div>
  );
};

const CandlestickChartsContent = ({ course, unitIndex, onMarkUnitComplete, onBack }) => {
  return (
    <CourseContentContainer>
      <BackButton onClick={onBack}>Back to Topics</BackButton>

      <ModuleHeader>Introduction</ModuleHeader>
      <LessonSection>
        <LessonDefinition>
          Candlestick charts are a fundamental tool in technical analysis, widely used in stock, forex, and crypto trading. They provide traders with detailed insights into market sentiment, price movements, and potential future trends. In this course, you will learn how to read candlestick charts effectively, identify key patterns, and make informed trading decisions.
        </LessonDefinition>
      </LessonSection>

      <ModuleHeader>Section 1: Understanding Candlesticks</ModuleHeader>
      <LessonSection>
        <LessonDefinition>
          A candlestick chart consists of individual "candles," each representing a specific time period (minutes, hours, days, etc.). The structure of a candlestick is composed of four main components:
        </LessonDefinition>
        <LessonKeyPoints>
          <LessonKeyPoint><strong>Open:</strong> The price at which the asset was traded at the start of the time period.</LessonKeyPoint>
          <LessonKeyPoint><strong>Close:</strong> The price at which the asset was traded at the end of the time period.</LessonKeyPoint>
          <LessonKeyPoint><strong>High:</strong> The highest price reached during the time period.</LessonKeyPoint>
          <LessonKeyPoint><strong>Low:</strong> The lowest price reached during the time period.</LessonKeyPoint>
        </LessonKeyPoints>
        <LessonDefinition>
          The candlestick's body is formed between the open and close prices, while the thin lines extending from the body (called "wicks" or "shadows") show the high and low prices for the period. If the close price is higher than the open, the candlestick is typically hollow (or green, depending on the platform). If the close price is lower than the open, the candlestick is filled (or red).
        </LessonDefinition>
      </LessonSection>

      <ModuleHeader>Section 2: Types of Candlesticks</ModuleHeader>
      <LessonSection>
        <LessonKeyPoints>
          <LessonKeyPoint><strong>Bullish Candlestick:</strong> Shows the close price is higher than the open price, indicating buying pressure. Typically green or hollow.</LessonKeyPoint>
          <LessonKeyPoint><strong>Bearish Candlestick:</strong> The close price is lower than the open price, showing selling pressure. Typically red or filled.</LessonKeyPoint>
          <LessonKeyPoint><strong>Doji:</strong> Forms when the open and close prices are nearly the same. Reflects market indecision and can signal a potential reversal or continuation.</LessonKeyPoint>
          <LessonKeyPoint><strong>Hammer:</strong> Has a small body at the top and a long lower shadow, indicating a potential reversal from a downtrend to an uptrend.</LessonKeyPoint>
          <LessonKeyPoint><strong>Engulfing Candlestick:</strong> Occurs when a small candle is followed by a large candle that completely engulfs the previous one. A bullish engulfing suggests an upward reversal, while a bearish engulfing suggests a downward trend.
          </LessonKeyPoint>
        </LessonKeyPoints>
      </LessonSection>

      <ModuleHeader>Section 3: Identifying Candlestick Patterns</ModuleHeader>
      <LessonSection>
        <LessonKeyPoints>
          <LessonKeyPoint><strong>Morning Star:</strong> A three-candle pattern with a large bearish candle, a small indecisive candle, and a large bullish candle. Typically signals a reversal from a downtrend to an uptrend.</LessonKeyPoint>
          <LessonKeyPoint><strong>Evening Star:</strong> The opposite pattern, with a large bullish candle, a small candle, and then a large bearish candle, indicating a potential reversal from an uptrend.</LessonKeyPoint>
          <LessonKeyPoint><strong>Shooting Star:</strong> Has a small body near the bottom and a long upper shadow, appearing in an uptrend and suggesting a potential downward reversal.</LessonKeyPoint>
          <LessonKeyPoint><strong>Doji Star:</strong> Consists of a Doji candle followed by a large candle. It signals market indecision that may lead to a reversal.
          </LessonKeyPoint>
        </LessonKeyPoints>
      </LessonSection>

      <ModuleHeader>Section 4: Applying Candlestick Patterns to Real-World Trading</ModuleHeader>
      <LessonSection>
        <LessonDefinition>
          Candlestick patterns play a key role in predicting market direction. They should not be used in isolation; instead, combine them with other technical indicators (like moving averages, support/resistance levels, and volume) to increase trading accuracy. Also, consider the broader market context to avoid false signals.
        </LessonDefinition>
        <LessonDefinition>
          For example, spotting a bullish engulfing pattern in a strong uptrend might signal a continuation of that trend. However, the same pattern during a downtrend might simply be a short-term correction.
        </LessonDefinition>
      </LessonSection>

      <QuizSection>
        <QuizHeader>Quiz: Test Your Candlestick Chart Knowledge</QuizHeader>
        <CandlestickChartsQuiz />
      </QuizSection>

      <EnrollButton onClick={() => { onMarkUnitComplete(course.id, unitIndex); onBack(); }}>
        Mark Topic Complete
      </EnrollButton>
    </CourseContentContainer>
  );
};
const CandlestickChartsQuiz = () => {
  const quizData = [
    {
      question: "What is the main difference between a bullish and a bearish candlestick?",
      options: [
        { value: 'a', text: "The body color" },
        { value: 'b', text: "The size of the wick" },
        { value: 'c', text: "The open and close prices" },
        { value: 'd', text: "The length of the body" },
      ],
      correctAnswer: 'c',
    },
    {
      question: "What does a Doji candlestick typically signify?",
      options: [
        { value: 'a', text: "A strong trend" },
        { value: 'b', text: "Indecision in the market" },
        { value: 'c', text: "A reversal pattern" },
        { value: 'd', text: "Continuation of the trend" },
      ],
      correctAnswer: 'b',
    },
    {
      question: "Which of the following candlestick patterns signals a potential upward reversal after a downtrend?",
      options: [
        { value: 'a', text: "Evening Star" },
        { value: 'b', text: "Hammer" },
        { value: 'c', text: "Shooting Star" },
        { value: 'd', text: "Bearish Engulfing" },
      ],
      correctAnswer: 'b',
    },
    {
      question: "What is a 'Morning Star' pattern?",
      options: [
        { value: 'a', text: "A small candle followed by a large bearish candle" },
        { value: 'b', text: "A large bullish candle followed by a Doji" },
        { value: 'c', text: "A three-candle pattern signaling a reversal to the upside" },
        { value: 'd', text: "A single bullish candlestick with a long upper wick" },
      ],
      correctAnswer: 'c',
    },
    {
      question: "True or False: Candlestick patterns should be used in isolation when making trading decisions.",
      options: [
        { value: 'a', text: "True" },
        { value: 'b', text: "False" },
      ],
      correctAnswer: 'b',
    },
    {
      question: "What is the purpose of combining candlestick patterns with other technical indicators like moving averages?",
      options: [
        { value: 'a', text: "To predict the exact price of the asset" },
        { value: 'b', text: "To confirm the strength of the signal" },
        { value: 'c', text: "To ignore market trends" },
        { value: 'd', text: "To make short-term profits only" },
      ],
      correctAnswer: 'b',
    },
  ];

  const [selectedAnswers, setSelectedAnswers] = useState({});

  const handleOptionChange = (qIndex, value) => {
    if (selectedAnswers[qIndex] !== undefined) return;
    setSelectedAnswers(prev => ({ ...prev, [qIndex]: value }));
  };

  const getOptionStyle = (qIndex, optionValue, correctAnswer) => {
    const selected = selectedAnswers[qIndex];
    if (!selected) return {};
    if (optionValue === selected) {
      return selected === correctAnswer 
             ? { backgroundColor: '#d4edda', borderColor: 'green', color: 'green' } 
             : { backgroundColor: '#f8d7da', borderColor: 'red', color: 'red' };
    } else if (optionValue === correctAnswer) {
      return { backgroundColor: '#d4edda', borderColor: 'green', color: 'green' };
    }
    return {};
  };

  return (
    <div>
      {quizData.map((q, qIndex) => (
        <QuestionContainer key={qIndex}>
          <p style={{ color: '#fff', fontWeight: 'bold' }}>{q.question}</p>
          {q.options.map(option => (
            <OptionContainer
              key={option.value}
              style={getOptionStyle(qIndex, option.value, q.correctAnswer)}
              onClick={() => handleOptionChange(qIndex, option.value)}
            >
              <input
                type="radio"
                name={`candlestick-question-${qIndex}`}
                value={option.value}
                checked={selectedAnswers[qIndex] === option.value}
                onChange={() => handleOptionChange(qIndex, option.value)}
                style={{ marginRight: '10px' }}
                disabled={selectedAnswers[qIndex] !== undefined}
              />
              <label>{option.value}) {option.text}</label>
            </OptionContainer>
          ))}
        </QuestionContainer>
      ))}
    </div>
  );
};

const SupportResistanceContent = ({ course, unitIndex, onMarkUnitComplete, onBack }) => {
  return (
    <CourseContentContainer>
      <BackButton onClick={onBack}>Back to Topics</BackButton>
 
      <ModuleHeader>Introduction</ModuleHeader>
      <LessonSection>
        <LessonDefinition>
          Support and resistance levels are crucial concepts in technical analysis, helping traders identify potential price points where an asset may reverse direction or stall its movement. By recognizing these levels, traders can make informed decisions about entering or exiting trades. This course will guide you through the essentials of support and resistance, how to identify them, and how to use them to improve your trading strategies.
        </LessonDefinition>
      </LessonSection>
 
      <ModuleHeader>Section 1: What Are Support and Resistance?</ModuleHeader>
      <LessonSection>
        <LessonDefinition>
          Support is a price level at which an asset tends to find buying interest as it declines. It acts as a "floor" that prevents the price from falling further. When the price approaches a support level, traders expect it to bounce back upward, as demand increases at this level.
        </LessonDefinition>
        <LessonDefinition>
          Resistance, on the other hand, is the price level at which selling pressure tends to increase as the asset rises. It acts as a "ceiling" that keeps the price from moving higher. When an asset reaches a resistance level, traders expect it to reverse downward as selling pressure dominates.
        </LessonDefinition>
        <LessonDefinition>
          Support and resistance levels can be identified through historical price action, moving averages, trend lines, or pivot points. Once these levels are identified, they become important reference points for making trading decisions.
        </LessonDefinition>
      </LessonSection>
   
      <ModuleHeader>Section 2: Identifying Support and Resistance</ModuleHeader>
      <LessonSection>
        <LessonDefinition>
          Identifying support and resistance levels requires analyzing past price movements. These levels are not always exact prices but can be ranges where price repeatedly bounces or stalls.
        </LessonDefinition>
        <LessonKeyPoints>
          <LessonKeyPoint>
            <strong>Horizontal Support and Resistance:</strong> This is the most common form of support and resistance, where price tends to reverse after touching the same level multiple times. The more times an asset touches a support or resistance level without breaking through, the stronger that level is considered.
          </LessonKeyPoint>
          <LessonKeyPoint>
            <strong>Trendline Support and Resistance:</strong> Trendlines are diagonal lines drawn along a series of highs or lows. An uptrend will have support along the trendline, while a downtrend will have resistance along it. These trendlines can act as dynamic support or resistance levels as long as the trend remains intact.
          </LessonKeyPoint>
          <LessonKeyPoint>
            <strong>Psychological Levels:</strong> Often, round numbers like 50, 100, or 1000 act as significant support or resistance levels. Traders commonly place orders at these levels, creating psychological barriers where prices may struggle to move past.
          </LessonKeyPoint>
        </LessonKeyPoints>
      </LessonSection>
   
      <ModuleHeader>Section 3: How to Use Support and Resistance in Trading</ModuleHeader>
      <LessonSection>
        <LessonDefinition>
          Support and resistance levels are essential for developing strategies such as breakout or reversal trading. Here's how to use them effectively:
        </LessonDefinition>
        <LessonKeyPoints>
          <LessonKeyPoint>
            <strong>Breakouts:</strong> When the price breaks through a support or resistance level, it often signals a continuation of the trend. A breakout above resistance can suggest an uptrend, while a breakdown below support can signal a downtrend.
          </LessonKeyPoint>
          <LessonKeyPoint>
            <strong>Reversals:</strong> When the price approaches a support or resistance level but fails to break it, a reversal may occur. Traders can look for confirmation signals, such as candlestick patterns, to enter trades in the direction of the reversal.
          </LessonKeyPoint>
          <LessonKeyPoint>
            <strong>Stop Losses and Take Profits:</strong> Support and resistance levels are also useful for setting stop losses and take-profit levels. Place stop losses just below support (in long trades) or above resistance (in short trades) to protect from unexpected price movements.
          </LessonKeyPoint>
        </LessonKeyPoints>
      </LessonSection>
  
      <ModuleHeader>Section 4: Why Support and Resistance Levels Change</ModuleHeader>
      <LessonSection>
        <LessonDefinition>
          Support and resistance levels are dynamic and may change over time due to shifts in market sentiment, news events, or changes in supply and demand. When a support level is broken, it may turn into resistance, and vice versa. This is called a role reversal, where previously tested levels become new areas of interest for traders.
        </LessonDefinition>
        <LessonDefinition>
          For example, if an asset breaks through a resistance level, that level could now serve as support in future price declines. Understanding these changes is key to adapting your trading strategies and managing risk effectively.
        </LessonDefinition>
      </LessonSection>
 
      <QuizSection>
        <QuizHeader>Quiz: Test Your Knowledge on Support and Resistance</QuizHeader>
        <SupportResistanceQuiz />
      </QuizSection>
      
      <EnrollButton onClick={() => { onMarkUnitComplete(course.id, unitIndex); onBack(); }}>
        Mark Topic Complete
      </EnrollButton>
    </CourseContentContainer>
  );
};

const SupportResistanceQuiz = () => {
  const quizData = [
    {
      question: "What is the primary role of support in technical analysis?",
      options: [
        { value: 'a', text: "To act as a price ceiling" },
        { value: 'b', text: "To prevent the price from falling further" },
        { value: 'c', text: "To signal an asset's trend reversal" },
        { value: 'd', text: "To increase trading volume" },
      ],
      correctAnswer: 'b',
    },
    {
      question: "Which of the following is true about resistance?",
      options: [
        { value: 'a', text: "It is the price level where buying pressure increases." },
        { value: 'b', text: "It is the price level where selling pressure increases." },
        { value: 'c', text: "It is irrelevant in a trending market." },
        { value: 'd', text: "It cannot be broken by price." },
      ],
      correctAnswer: 'b',
    },
    {
      question: "What does it mean when a price breaks through support or resistance?",
      options: [
        { value: 'a', text: "The market is showing indecision." },
        { value: 'b', text: "The price is likely to continue in the direction of the breakout." },
        { value: 'c', text: "The asset is overvalued." },
        { value: 'd', text: "The asset has reached its peak price." },
      ],
      correctAnswer: 'b',
    },
    {
      question: "What is a role reversal in the context of support and resistance?",
      options: [
        { value: 'a', text: "Support becomes resistance after it is broken." },
        { value: 'b', text: "Resistance becomes support after it is broken." },
        { value: 'c', text: "Support and resistance are irrelevant." },
        { value: 'd', text: "Both support and resistance levels remain fixed forever." },
      ],
      correctAnswer: 'a',
    },
    {
      question: "True or False: Trendlines act as dynamic support or resistance levels.",
      options: [
        { value: 'a', text: "True" },
        { value: 'b', text: "False" },
      ],
      correctAnswer: 'a',
    },
    {
      question: "When identifying support and resistance, what do psychological levels often represent?",
      options: [
        { value: 'a', text: "Random price movements" },
        { value: 'b', text: "Price levels that traders pay attention to due to their round nature" },
        { value: 'c', text: "Levels that are always accurate" },
        { value: 'd', text: "Levels that are not affected by market trends" },
      ],
      correctAnswer: 'b',
    },
  ];

  const [selectedAnswers, setSelectedAnswers] = useState({});

  const handleOptionChange = (qIndex, value) => {
    if (selectedAnswers[qIndex] !== undefined) return;
    setSelectedAnswers(prev => ({ ...prev, [qIndex]: value }));
  };

  const getOptionStyle = (qIndex, optionValue, correctAnswer) => {
    const selected = selectedAnswers[qIndex];
    if (!selected) return {};
    if (optionValue === selected) {
      return selected === correctAnswer 
             ? { backgroundColor: '#d4edda', borderColor: 'green', color: 'green' } 
             : { backgroundColor: '#f8d7da', borderColor: 'red', color: 'red' };
    } else if (optionValue === correctAnswer) {
      return { backgroundColor: '#d4edda', borderColor: 'green', color: 'green' };
    }
    return {};
  };

  return (
    <div>
      {quizData.map((q, qIndex) => (
        <QuestionContainer key={qIndex}>
          <p style={{ color: '#fff', fontWeight: 'bold' }}>{q.question}</p>
          {q.options.map(option => (
            <OptionContainer
              key={option.value}
              style={getOptionStyle(qIndex, option.value, q.correctAnswer)}
              onClick={() => handleOptionChange(qIndex, option.value)}
            >
              <input
                type="radio"
                name={`support-resistance-question-${qIndex}`}
                value={option.value}
                checked={selectedAnswers[qIndex] === option.value}
                onChange={() => handleOptionChange(qIndex, option.value)}
                style={{ marginRight: '10px' }}
                disabled={selectedAnswers[qIndex] !== undefined}
              />
              <label>{option.value}) {option.text}</label>
            </OptionContainer>
          ))}
        </QuestionContainer>
      ))}
    </div>
  );
};

const DayTradingVsSwingVsPositionContent = ({ course, unitIndex, onMarkUnitComplete, onBack }) => {
  return (
    <CourseContentContainer>
      <BackButton onClick={onBack}>Back to Topics</BackButton>
      
      <ModuleHeader>Introduction</ModuleHeader>
      <LessonSection>
        <LessonDefinition>
          In the world of trading, there are different strategies based on how long a trader holds positions in the market. Three of the most popular styles are day trading, swing trading, and position trading. Each approach has its own strengths, risks, and time commitment. In this course, we’ll explore the differences between these strategies, helping you decide which one suits your trading style, risk tolerance, and goals.
        </LessonDefinition>
      </LessonSection>

      <ModuleHeader>Section 1: Day Trading</ModuleHeader>
      <LessonSection>
        <LessonDefinition>
          Day trading involves buying and selling financial instruments within the same trading day, often multiple times. The goal is to capitalize on small price movements throughout the day, making profits from short-term fluctuations in price. Day traders typically close all positions by the end of the day to avoid overnight risks.
        </LessonDefinition>
        <LessonDefinition>
          <strong>Time Commitment:</strong> Day traders monitor the market constantly throughout the day, making quick decisions. This requires a significant time commitment, as they must track news, price movements, and technical indicators in real-time.
        </LessonDefinition>
        <LessonDefinition>
          <strong>Tools and Techniques:</strong> Day traders rely heavily on technical analysis, using charts, indicators, and short-term trends to make fast decisions. Popular tools include moving averages, candlestick patterns, and volume analysis. They often use leverage to increase potential profits.
        </LessonDefinition>
        <LessonDefinition>
          <strong>Risk and Reward:</strong> Day trading can offer high rewards, but it also carries substantial risks. The need to make quick decisions can lead to emotional trading, and market volatility can result in significant losses. As such, day trading requires discipline and a clear strategy to succeed.
        </LessonDefinition>
        <LessonDefinition>
          <strong>Suitability:</strong> Day trading is best suited for individuals who enjoy fast-paced environments, can dedicate hours each day to market analysis, and have the ability to handle high-stress situations.
        </LessonDefinition>
      </LessonSection>
  
      <ModuleHeader>Section 2: Swing Trading</ModuleHeader>
      <LessonSection>
        <LessonDefinition>
          Swing trading is a medium-term strategy that involves holding positions for several days or weeks to capture price movements or "swings." Unlike day traders, swing traders aim to profit from larger market moves rather than tiny, short-term fluctuations.
        </LessonDefinition>
        <LessonDefinition>
          <strong>Time Commitment:</strong> Swing traders typically spend less time in front of the screen than day traders. They do their analysis and set their trades, but they do not need to monitor the markets continuously. However, they may need to check their positions daily.
        </LessonDefinition>
        <LessonDefinition>
          <strong>Tools and Techniques:</strong> Swing traders use a combination of technical analysis and some fundamental analysis to identify potential market swings. They look for key levels of support and resistance, chart patterns, and trends to predict the next move in the market. Swing traders tend to hold positions through market fluctuations and avoid being swayed by short-term volatility.
        </LessonDefinition>
        <LessonDefinition>
          <strong>Risk and Reward:</strong> Swing trading offers a good balance of risk and reward. While the holding period is longer than day trading, the profits can be more substantial if the swing captures a larger price movement. However, swings can be unpredictable, and there is still a risk of significant loss if market conditions change rapidly.
        </LessonDefinition>
        <LessonDefinition>
          <strong>Suitability:</strong> Swing trading is ideal for traders who cannot dedicate the entire day to monitoring the markets but still want to capitalize on medium-term trends. It is also suitable for those who are comfortable with a bit of market volatility and have a moderate risk tolerance.
        </LessonDefinition>
      </LessonSection>

      <ModuleHeader>Section 3: Position Trading</ModuleHeader>
      <LessonSection>
        <LessonDefinition>
          Position trading is the longest-term trading style. Position traders hold their assets for weeks, months, or even years, aiming to profit from long-term trends and price movements. Unlike day traders and swing traders, position traders are less concerned with short-term market fluctuations.
        </LessonDefinition>
        <LessonDefinition>
          <strong>Time Commitment:</strong> Position trading requires the least amount of time commitment compared to day trading and swing trading. Once a position is set, traders only need to monitor it periodically to ensure it is in line with their long-term strategy.
        </LessonDefinition>
        <LessonDefinition>
          <strong>Tools and Techniques:</strong> Position traders rely heavily on fundamental analysis, looking at economic data, corporate earnings, and macroeconomic trends. While technical analysis may play a role, the focus is on the bigger picture and long-term trends. Position traders use tools like moving averages and trend lines to identify market entry points.
        </LessonDefinition>
        <LessonDefinition>
          <strong>Risk and Reward:</strong> Position trading offers the potential for significant returns over the long run, especially when capturing large market moves. However, it also exposes traders to long-term market risks, including economic downturns or geopolitical events that can affect prices over extended periods.
        </LessonDefinition>
        <LessonDefinition>
          <strong>Suitability:</strong> Position trading is best suited for individuals with a long-term outlook who do not want to be constantly engaged in the markets. It’s ideal for those who prefer to research and wait for bigger, more sustainable trends rather than react to short-term market changes.
        </LessonDefinition>
      </LessonSection>

      <QuizSection>
        <QuizHeader>Quiz: Test Your Knowledge on Trading Styles</QuizHeader>
        <DayTradingVsSwingVsPositionQuiz />
      </QuizSection>
      
      <EnrollButton onClick={() => { onMarkUnitComplete(course.id, unitIndex); onBack(); }}>
        Mark Topic Complete
      </EnrollButton>
    </CourseContentContainer>
  );
};

const DayTradingVsSwingVsPositionQuiz = () => {
  const quizData = [
    {
      question: "Which of the following trading styles involves holding positions for only a single day?",
      options: [
        { value: 'a', text: "Swing Trading" },
        { value: 'b', text: "Position Trading" },
        { value: 'c', text: "Day Trading" },
        { value: 'd', text: "Long-Term Investing" },
      ],
      correctAnswer: 'c',
    },
    {
      question: "Which type of trading is best suited for individuals who cannot monitor the markets continuously but still want to capture medium-term trends?",
      options: [
        { value: 'a', text: "Day Trading" },
        { value: 'b', text: "Swing Trading" },
        { value: 'c', text: "Position Trading" },
        { value: 'd', text: "Scalping" },
      ],
      correctAnswer: 'b',
    },
    {
      question: "True or False: Swing traders aim to profit from long-term market movements that take months or years to materialize.",
      options: [
        { value: 'a', text: "True" },
        { value: 'b', text: "False" },
      ],
      correctAnswer: 'b',
    },
    {
      question: "What is a primary characteristic of position trading?",
      options: [
        { value: 'a', text: "Focus on short-term price fluctuations" },
        { value: 'b', text: "Profit from larger, long-term trends" },
        { value: 'c', text: "Involves constant market monitoring" },
        { value: 'd', text: "Leverages technical analysis heavily" },
      ],
      correctAnswer: 'b',
    },
    {
      question: "Which of the following is a common tool used by day traders?",
      options: [
        { value: 'a', text: "Moving averages" },
        { value: 'b', text: "Economic data" },
        { value: 'c', text: "Fundamental analysis" },
        { value: 'd', text: "Long-term trends" },
      ],
      correctAnswer: 'a',
    },
    {
      question: "What is a typical risk associated with day trading?",
      options: [
        { value: 'a', text: "Low returns" },
        { value: 'b', text: "Emotional decision-making due to the fast-paced nature" },
        { value: 'c', text: "Minimal time commitment" },
        { value: 'd', text: "Focus on long-term trends" },
      ],
      correctAnswer: 'b',
    },
  ];

  const [selectedAnswers, setSelectedAnswers] = useState({});

  const handleOptionChange = (qIndex, value) => {
    if (selectedAnswers[qIndex] !== undefined) return;
    setSelectedAnswers(prev => ({ ...prev, [qIndex]: value }));
  };

  const getOptionStyle = (qIndex, optionValue, correctAnswer) => {
    const selected = selectedAnswers[qIndex];
    if (!selected) return {};
    if (optionValue === selected) {
      return selected === correctAnswer 
             ? { backgroundColor: '#d4edda', borderColor: 'green', color: 'green' } 
             : { backgroundColor: '#f8d7da', borderColor: 'red', color: 'red' };
    } else if (optionValue === correctAnswer) {
      return { backgroundColor: '#d4edda', borderColor: 'green', color: 'green' };
    }
    return {};
  };

  return (
    <div>
      {quizData.map((q, qIndex) => (
        <QuestionContainer key={qIndex}>
          <p style={{ color: '#fff', fontWeight: 'bold' }}>{q.question}</p>
          {q.options.map(option => (
            <OptionContainer
              key={option.value}
              style={getOptionStyle(qIndex, option.value, q.correctAnswer)}
              onClick={() => handleOptionChange(qIndex, option.value)}
            >
              <input
                type="radio"
                name={`trading-styles-question-${qIndex}`}
                value={option.value}
                checked={selectedAnswers[qIndex] === option.value}
                onChange={() => handleOptionChange(qIndex, option.value)}
                style={{ marginRight: '10px' }}
                disabled={selectedAnswers[qIndex] !== undefined}
              />
              <label>{option.value}) {option.text}</label>
            </OptionContainer>
          ))}
        </QuestionContainer>
      ))}
    </div>
  );
};

const MomentumTradingVsValueInvestingContent = ({ course, unitIndex, onMarkUnitComplete, onBack }) => {
  return (
    <CourseContentContainer>
      <BackButton onClick={onBack}>Back to Topics</BackButton>

      <ModuleHeader>Introduction</ModuleHeader>
      <LessonSection>
        <LessonDefinition>
          Momentum trading and value investing are two distinct investment strategies used by traders and investors to make profits in the market. Both approaches have their own philosophies, risk profiles, and time horizons. In this course, we'll compare and contrast these strategies, exploring how they work, their key differences, and which might be right for you.
        </LessonDefinition>
      </LessonSection>
      
      
      <ModuleHeader>Section 1: What is Momentum Trading?</ModuleHeader>
      <LessonSection>
        <LessonDefinition>
          Momentum trading is a strategy that involves buying assets that are trending upward and selling those that are trending downward. The basic idea behind momentum trading is that stocks or other financial instruments that are moving in one direction tend to keep moving in that direction. Momentum traders look to capitalize on short-term price movements and trends, often using technical indicators to identify entry and exit points.
        </LessonDefinition>
        <LessonDefinition>
          <strong>Time Commitment:</strong> Momentum trading requires frequent monitoring of the markets. Traders often buy and sell assets on short notice, sometimes within minutes or hours, depending on the trade. This strategy is more time-intensive and fast-paced compared to other methods.
        </LessonDefinition>
        <LessonDefinition>
          <strong>Tools and Techniques:</strong> Momentum traders use technical analysis to spot trends, relying on tools such as moving averages, RSI (Relative Strength Index), MACD (Moving Average Convergence Divergence), and volume analysis. These tools help identify when a stock is gaining momentum and when the trend may be reversing.
        </LessonDefinition>
        <LessonDefinition>
          <strong>Risk and Reward:</strong> Momentum trading can offer high rewards in a short amount of time, but it also involves high risk. Because the strategy relies on the assumption that trends will continue, traders may face significant losses if a trend reverses unexpectedly. Therefore, effective risk management and timely exit strategies are crucial.
        </LessonDefinition>
        <LessonDefinition>
          <strong>Suitability:</strong> Momentum trading is best for active traders who can dedicate time to the market and are comfortable with high volatility. It's ideal for those who enjoy fast-paced, short-term trading and are prepared to react quickly to changing market conditions.
        </LessonDefinition>
      </LessonSection>
      

      <ModuleHeader>Section 2: What is Value Investing?</ModuleHeader>
      <LessonSection>
        <LessonDefinition>
          Value investing is a long-term investment strategy that involves buying undervalued stocks or assets—those that are trading for less than their intrinsic value. Value investors believe that the market tends to overreact to short-term news and trends, which creates opportunities to buy quality assets at discounted prices. Over time, the market corrects itself, and the asset's true value is realized, leading to potential profits.
        </LessonDefinition>
        <LessonDefinition>
          <strong>Time Commitment:</strong> Value investing requires a long-term commitment and patience. Investors must be willing to hold onto their investments for several years, sometimes decades, as they wait for the market to recognize the true value of the asset.
        </LessonDefinition>
        <LessonDefinition>
          <strong>Tools and Techniques:</strong> Value investors rely on fundamental analysis, focusing on financial metrics like earnings, price-to-earnings (P/E) ratio, book value, and dividends to assess whether a stock is undervalued. They also look at factors like the company’s management, competitive position, and overall industry trends.
        </LessonDefinition>
        <LessonDefinition>
          <strong>Risk and Reward:</strong> The risk in value investing comes from the possibility that an asset remains undervalued for a long period, or that its value may never be fully realized. However, when executed well, value investing can lead to substantial rewards as undervalued stocks tend to appreciate over time. This strategy is less volatile than momentum trading.
        </LessonDefinition>
        <LessonDefinition>
          <strong>Suitability:</strong> Value investing is best for long-term investors who are patient and focused on the fundamentals. It suits those who are less concerned with short-term price fluctuations and are looking to accumulate wealth over many years.
        </LessonDefinition>
      </LessonSection>
      
      
      <ModuleHeader>Section 3: Momentum Trading vs. Value Investing: Key Differences</ModuleHeader>
      <LessonSection>
        <LessonDefinition>
          While both momentum trading and value investing aim to generate profits in the market, their approaches are fundamentally different.
        </LessonDefinition>
        <LessonKeyPoints>
          <LessonKeyPoint>
            <strong>Time Horizon:</strong> Momentum traders focus on short-term trends (minutes, hours, or days), while value investors hold assets for years.
          </LessonKeyPoint>
          <LessonKeyPoint>
            <strong>Approach to Market Behavior:</strong> Momentum traders rely on market trends and price action, believing that assets in motion continue in the same direction. Value investors believe that the market can be inefficient and that quality assets are often undervalued.
          </LessonKeyPoint>
          <LessonKeyPoint>
            <strong>Risk and Volatility:</strong> Momentum trading involves higher risk and volatility due to its short-term nature, whereas value investing is generally less volatile.
          </LessonKeyPoint>
          <LessonKeyPoint>
            <strong>Tools Used:</strong> Momentum traders use technical analysis (e.g., moving averages, RSI, MACD), while value investors rely on fundamental analysis.
          </LessonKeyPoint>
        </LessonKeyPoints>
      </LessonSection>
      

      <QuizSection>
        <QuizHeader>Quiz: Test Your Knowledge on Momentum Trading vs. Value Investing</QuizHeader>
        <MomentumTradingVsValueInvestingQuiz />
      </QuizSection>
      
      <EnrollButton onClick={() => { onMarkUnitComplete(course.id, unitIndex); onBack(); }}>
        Mark Topic Complete
      </EnrollButton>
    </CourseContentContainer>
  );
};

const MomentumTradingVsValueInvestingQuiz = () => {
  const quizData = [
    {
      question: "Which of the following strategies involves buying stocks that are trending upward in the short term?",
      options: [
        { value: 'a', text: "Momentum Trading" },
        { value: 'b', text: "Value Investing" },
        { value: 'c', text: "Long-Term Investing" },
        { value: 'd', text: "Dividend Investing" },
      ],
      correctAnswer: 'a',
    },
    {
      question: "True or False: Momentum traders rely on fundamental analysis to evaluate whether an asset is undervalued.",
      options: [
        { value: 'a', text: "True" },
        { value: 'b', text: "False" },
      ],
      correctAnswer: 'b',
    },
    {
      question: "What is the main focus of value investing?",
      options: [
        { value: 'a', text: "Identifying short-term market trends" },
        { value: 'b', text: "Buying undervalued assets and holding them for the long term" },
        { value: 'c', text: "Making quick profits by selling on price movements" },
        { value: 'd', text: "Analyzing price charts and technical indicators" },
      ],
      correctAnswer: 'b',
    },
    {
      question: "Which of the following tools is commonly used by momentum traders?",
      options: [
        { value: 'a', text: "P/E ratio" },
        { value: 'b', text: "Moving averages" },
        { value: 'c', text: "Dividends" },
        { value: 'd', text: "Earnings growth" },
      ],
      correctAnswer: 'b',
    },
    {
      question: "What is the main risk in momentum trading?",
      options: [
        { value: 'a', text: "Holding onto investments for too long" },
        { value: 'b', text: "Unexpected trend reversals and market volatility" },
        { value: 'c', text: "Missing out on long-term growth opportunities" },
        { value: 'd', text: "Ignoring the fundamentals of companies" },
      ],
      correctAnswer: 'b',
    },
    {
      question: "Which strategy is best suited for individuals with a long-term investment outlook and patience?",
      options: [
        { value: 'a', text: "Momentum Trading" },
        { value: 'b', text: "Swing Trading" },
        { value: 'c', text: "Value Investing" },
        { value: 'd', text: "Day Trading" },
      ],
      correctAnswer: 'c',
    },
  ];

  const [selectedAnswers, setSelectedAnswers] = useState({});

  const handleOptionChange = (qIndex, value) => {
    if (selectedAnswers[qIndex] !== undefined) return;
    setSelectedAnswers(prev => ({ ...prev, [qIndex]: value }));
  };

  const getOptionStyle = (qIndex, optionValue, correctAnswer) => {
    const selected = selectedAnswers[qIndex];
    if (!selected) return {};
    if (optionValue === selected) {
      return selected === correctAnswer
        ? { backgroundColor: '#d4edda', borderColor: 'green', color: 'green' }
        : { backgroundColor: '#f8d7da', borderColor: 'red', color: 'red' };
    } else if (optionValue === correctAnswer) {
      return { backgroundColor: '#d4edda', borderColor: 'green', color: 'green' };
    }
    return {};
  };

  return (
    <div>
      {quizData.map((q, qIndex) => (
        <QuestionContainer key={qIndex}>
          <p style={{ color: '#fff', fontWeight: 'bold' }}>{q.question}</p>
          {q.options.map(option => (
            <OptionContainer
              key={option.value}
              style={getOptionStyle(qIndex, option.value, q.correctAnswer)}
              onClick={() => handleOptionChange(qIndex, option.value)}
            >
              <input
                type="radio"
                name={`momentum-value-question-${qIndex}`}
                value={option.value}
                checked={selectedAnswers[qIndex] === option.value}
                onChange={() => handleOptionChange(qIndex, option.value)}
                style={{ marginRight: '10px' }}
                disabled={selectedAnswers[qIndex] !== undefined}
              />
              <label>{option.value}) {option.text}</label>
            </OptionContainer>
          ))}
        </QuestionContainer>
      ))}
    </div>
  );
};


// Unit details
const UnitDetail = ({ course, unitIndex, onMarkUnitComplete, onBack }) => {
  const topic = course.topics[unitIndex];
  
  // Conditional rendering based on topic
  if (topic === "Introduction to Financial Markets") {
    return (
      <FinancialMarketsContent
        course={course}
        unitIndex={unitIndex}
        onMarkUnitComplete={onMarkUnitComplete}
        onBack={onBack}
      />
    );
  }
  
  if (topic === "How Stock Exchanges Work (NYSE, NASDAQ, LSE, etc.)") {
    return (
      <StockExchangesContent
        course={course}
        unitIndex={unitIndex}
        onMarkUnitComplete={onMarkUnitComplete}
        onBack={onBack}
      />
    );
  }

  if (topic === "Types of Stocks (Common vs. Preferred)") {
    return (
      <TypesOfStocksContent
        course={course}
        unitIndex={unitIndex}
        onMarkUnitComplete={onMarkUnitComplete}
        onBack={onBack}
      />
    );
  }
  
  if (topic === "How to Read Financial Statements (Balance Sheet, Income Statement, Cash Flow)") {
    return (
      <FinancialStatementsContent
        course={course}
        unitIndex={unitIndex}
        onMarkUnitComplete={onMarkUnitComplete}
        onBack={onBack}
      />
    );
  }

  if (topic === "Understanding Valuation Metrics (P/E Ratio, EPS, ROE, etc.)") {
    return (
      <ValuationMetricsContent
        course={course}
        unitIndex={unitIndex}
        onMarkUnitComplete={onMarkUnitComplete}
        onBack={onBack}
      />
    );
  }
  if (topic === "Economic and Industry Analysis") {
    return (
      <EconomicIndustryAnalysisContent
        course={course}
        unitIndex={unitIndex}
        onMarkUnitComplete={onMarkUnitComplete}
        onBack={onBack}
      />
    );
  }

  if (topic === "How to Read Candlestick Charts") {
    return (
      <CandlestickChartsContent
        course={course}
        unitIndex={unitIndex}
        onMarkUnitComplete={onMarkUnitComplete}
        onBack={onBack}
      />
    );
  }

  if (topic === "Support and Resistance Levels") {
    return (
      <SupportResistanceContent
        course={course}
        unitIndex={unitIndex}
        onMarkUnitComplete={onMarkUnitComplete}
        onBack={onBack}
      />
    );
  }
  
  if (topic === "Day Trading vs. Swing Trading vs. Position Trading") {
    return (
      <DayTradingVsSwingVsPositionContent
        course={course}
        unitIndex={unitIndex}
        onMarkUnitComplete={onMarkUnitComplete}
        onBack={onBack}
      />
    );
  }

  if (topic === "Momentum Trading vs. Value Investing") {
    return (
      <MomentumTradingVsValueInvestingContent
        course={course}
        unitIndex={unitIndex}
        onMarkUnitComplete={onMarkUnitComplete}
        onBack={onBack}
      />
    );
  }

  return (
    <div style={{ padding: '20px', color: '#fff' }}>
      <BackButton onClick={onBack}>Back to Topics</BackButton>
      <h2>Topic {unitIndex + 1}: {topic}</h2>
      <p>
        Here is all the information you need about <strong>{topic}</strong>. This section contains detailed explanations, examples, and insights.
      </p>
    </div>
  );
};


//Courses Details
const CourseDetail = ({ course, onBack, onMarkUnitComplete }) => {
  const [selectedUnit, setSelectedUnit] = useState(null);
  const totalUnits = course.topics.length;
  const completedUnits = course.completedUnits || [];
  const progress = Math.floor((completedUnits.length / totalUnits) * 100);


  if (selectedUnit !== null) {
    return (
      <UnitDetail
        course={course}
        unitIndex={selectedUnit}
        onMarkUnitComplete={onMarkUnitComplete}
        onBack={() => setSelectedUnit(null)}
      />
    );
  }

  // Mapping for locked topics per course
  const lockedTopicsMapping = {
    1: [3, 4],
    2: [3, 4],
    3: [2, 3, 4],
    4: [2, 3, 4],
    5: "all"
  };

  return (
    <div style={{ padding: '20px', color: '#fff' }}>
      <BackButton onClick={onBack}>Back to My Courses</BackButton>
      <h3 style={{ marginTop: '20px' }}>Topics</h3>
      {course.topics.map((topic, index) => {
        const isLocked =
          course.id === 5 ||
          (lockedTopicsMapping[course.id] !== "all" &&
            lockedTopicsMapping[course.id] &&
            lockedTopicsMapping[course.id].includes(index));
        return (
          <div
            key={index}
            style={{
              border: '1px solid cyan',
              borderRadius: '5px',
              padding: '10px',
              marginBottom: '10px',
              background: isLocked ? 'grey' : '#1c1c3a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              {completedUnits.includes(index) ? (
                <FaCheck style={{ color: 'green' }} /> // Checkmark for completed
              ) : (
                <FaLock style={{ color: isLocked ? 'lightgrey' : undefined }} /> // Lock icon
              )}
              <span style={{ fontWeight: 'bold' }}>Topic {index + 1}:</span> {topic}
            </div>
            {isLocked ? (
              <EnrollButton disabled style={{ backgroundColor: 'grey', cursor: 'not-allowed' }}>
                Coming Soon
              </EnrollButton>
            ) : (
              <EnrollButton onClick={() => setSelectedUnit(index)}>
                {completedUnits.includes(index) ? "Review Topic" : "Start"}
              </EnrollButton>
            )}
          </div>
        );
      })}
      <div style={{ marginTop: '20px' }}>
        <p>Overall Progress: {progress}%</p>
        <ProgressBarContainer>
          <ProgressBarFiller progress={progress} />
        </ProgressBarContainer>
      </div>
    </div>
  );
};


//My courses section component
const MyCoursesSection = ({ enrolledCourses, setEnrolledCourses }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Enroll in a new course
  const handleEnrollCourse = (course) => {
    if (course.id === 5) return; // Course 5 is locked
    if (!enrolledCourses.find((c) => c.id === course.id)) {
      setEnrolledCourses([...enrolledCourses, { ...course, completedUnits: [] }]);
    }
  };

    // Start a selected course
  const handleStartCourse = (courseId) => {
    const course = enrolledCourses.find((c) => c.id === courseId);
    if (course) {
      setSelectedCourse(course);
    }
  };

  // Mark a unit as complete
  const handleMarkUnitComplete = (courseId, unitIndex) => {
    setEnrolledCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId && !c.completedUnits.includes(unitIndex)) {
          return { ...c, completedUnits: [...c.completedUnits, unitIndex] };
        }
        return c;
      })
    );
    if (selectedCourse && selectedCourse.id === courseId) {
      setSelectedCourse((prev) => {
        if (prev && !prev.completedUnits.includes(unitIndex)) {
          return { ...prev, completedUnits: [...prev.completedUnits, unitIndex] };
        }
        return prev;
      });
    }
  };

  const availableCourses = myCoursesData.filter(
    (course) => !enrolledCourses.find((c) => c.id === course.id)
  );

  if (selectedCourse) {
    return (
      <CourseDetail
        course={selectedCourse}
        onBack={() => setSelectedCourse(null)}
        onMarkUnitComplete={handleMarkUnitComplete}
      />
    );
  }

  return (
    <>
      <div style={{ padding: '20px', color: '#fff' }}>
        <DashboardHeader>My Enrolled Courses</DashboardHeader>
        {enrolledCourses.length === 0 ? (
          <div>No courses enrolled yet.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {enrolledCourses.map((course) => {
              const progress = Math.floor((course.completedUnits.length / course.topics.length) * 100);
              return (
                <div
                  key={course.id}
                  style={{
                    border: '1px solid cyan',
                    borderRadius: '5px',
                    padding: '10px',
                    background: '#1c1c3a',
                  }}
                >
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                    {course.title}
                  </div>
                  <EnrollButton onClick={() => handleStartCourse(course.id)}>
                    Start Course
                  </EnrollButton>
                  <ProgressBarContainer>
                    <ProgressBarFiller progress={progress} />
                  </ProgressBarContainer>
                  <div style={{ fontSize: '0.8rem', margin: '5px 0' }}>
                    {progress}% completed
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <AvailableCoursesSidebar availableCourses={availableCourses} onEnrollCourse={handleEnrollCourse} />
    </>
  );
};


//Calendar page
const FullScreenCalendarContainer = styled.div`
  width: 100%;
  height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #1c1c3a, #2a1f42);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CalendarHeaderContainer = styled.div`
  width: 90%;
  max-width: 1200px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const VerticalBar = styled.div`
  width: 4px;
  height: 40px;
  background: #7df9ff;
  margin-right: 10px;
`;

const CalendarHeaderText = styled.h1`
  font-size: 2.5rem;
  color: #7df9ff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  margin: 0;
`;

const CalendarWrapper = styled.div`
  width: 90%;
  max-width: 1200px;
  height: 600px;
  background: #1c1c3a;
  border: 2px solid #7df9ff;
  border-radius: 15px;
  padding: 0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  display: flex;
`;

const NotesAndRemindersContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
  width: 90%;
  max-width: 1200px;
`;

const NotesContainer = styled.div`
  flex: 1;
  background: #1c1c3a;
  border: 2px solid #7df9ff;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
`;

const RemindersContainer = styled.div`
  flex: 1;
  background: #1c1c3a;
  border: 2px solid #7df9ff;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #7df9ff;
  margin-bottom: 15px;
`;

const NotesTextarea = styled.textarea`
  width: 100%;
  height: 150px;
  padding: 10px;
  background: #121212;
  border: 1px solid #7df9ff;
  border-radius: 10px;
  color: #fff;
  font-family: 'Poppins', sans-serif;
  resize: none;
`;

const ReminderList = styled.ul`
  list-style: none;
  padding: 0;
`;

const ReminderItem = styled.li`
  background: #121212;
  border: 1px solid #7df9ff;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DeadlineList = styled.ul`
  list-style: none;
  padding: 0;
`;

const DeadlineItem = styled.li`
  background: #121212;
  border: 1px solid #ff6f61;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AddReminderButton = styled.button`
  background: #7df9ff;
  color: #121212;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  margin-right: 10px;
  &:hover {
    background: cyan;
  }
`;

const AddDeadlineButton = styled.button`
  background: #ff6f61;
  color: #121212;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    background: #ff8c7a;
  }
`;

const ModalOverlayCalendar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const ModalContentCalendar = styled.div`
  background: #1c1c3a;
  padding: 20px;
  border: 2px solid #7df9ff;
  border-radius: 15px;
  width: 90%;
  max-width: 400px;
`;

const ModalTitleCalendar = styled.h3`
  color: #7df9ff;
  margin-bottom: 10px;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 10px;
  background: #121212;
  border: 1px solid #7df9ff;
  border-radius: 10px;
  color: #fff;
  font-family: 'Poppins', sans-serif;
  margin-bottom: 10px;
`;

const ModalButtonsCalendar = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const ModalButtonCalendar = styled.button`
  background: ${(props) => (props.cancel ? '#ff6f61' : '#7df9ff')};
  color: #121212;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    opacity: 0.9;
  }
`;

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState(() => localStorage.getItem("calendar_notes") || "");
  const [reminders, setReminders] = useState(() => {
    const storedReminders = localStorage.getItem("calendar_reminders");
    return storedReminders ? JSON.parse(storedReminders) : [];
  });
  const [deadlines, setDeadlines] = useState(() => {
    const storedDeadlines = localStorage.getItem("calendar_deadlines");
    return storedDeadlines ? JSON.parse(storedDeadlines) : [];
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('reminder');
  const [inputValue, setInputValue] = useState('');

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem("calendar_notes", notes);
  }, [notes]);

  useEffect(() => {
    localStorage.setItem("calendar_reminders", JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem("calendar_deadlines", JSON.stringify(deadlines));
  }, [deadlines]);

  const handleAddReminder = () => {
    setModalType('reminder');
    setModalOpen(true);
  };

  const handleAddDeadline = () => {
    setModalType('deadline');
    setModalOpen(true);
  };

  const handleSave = () => {
    if (modalType === 'reminder') {
      setReminders([...reminders, { id: Date.now(), text: inputValue, date: date.toDateString() }]);
    } else if (modalType === 'deadline') {
      setDeadlines([...deadlines, { id: Date.now(), text: inputValue, date: date.toDateString() }]);
    }
    setInputValue('');
    setModalOpen(false);
  };

  const handleDeleteReminder = (id) => {
    setReminders(reminders.filter((reminder) => reminder.id !== id));
  };

  const handleDeleteDeadline = (id) => {
    setDeadlines(deadlines.filter((deadline) => deadline.id !== id));
  };

  return (
    <FullScreenCalendarContainer>
      <CalendarHeaderContainer>
        <VerticalBar />
        <CalendarHeaderText>Calendar</CalendarHeaderText>
      </CalendarHeaderContainer>
      <CalendarWrapper>
        <Calendar onChange={setDate} value={date} />
      </CalendarWrapper>
      <NotesAndRemindersContainer>
        <NotesContainer>
          <SectionTitle>Notes</SectionTitle>
          <NotesTextarea
            placeholder="Write your notes here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </NotesContainer>
        <RemindersContainer>
          <SectionTitle>Reminders & Deadlines</SectionTitle>
          <div>
            <AddReminderButton onClick={handleAddReminder}>Add Reminder</AddReminderButton>
            <AddDeadlineButton onClick={handleAddDeadline}>Add Deadline</AddDeadlineButton>
          </div>
          <ReminderList>
            {reminders.map((reminder) => (
              <ReminderItem key={reminder.id}>
                <span>{reminder.text}</span>
                <button onClick={() => handleDeleteReminder(reminder.id)}>Delete</button>
              </ReminderItem>
            ))}
          </ReminderList>
          <DeadlineList>
            {deadlines.map((deadline) => (
              <DeadlineItem key={deadline.id}>
                <span>{deadline.text}</span>
                <button onClick={() => handleDeleteDeadline(deadline.id)}>Delete</button>
              </DeadlineItem>
            ))}
          </DeadlineList>
        </RemindersContainer>
      </NotesAndRemindersContainer>
      {modalOpen && (
        <ModalOverlayCalendar onClick={() => setModalOpen(false)}>
          <ModalContentCalendar onClick={(e) => e.stopPropagation()}>
            <ModalTitleCalendar>
              {modalType === 'reminder' ? 'Add Reminder' : 'Add Deadline'}
            </ModalTitleCalendar>
            <ModalInput
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
             placeholder={`Enter ${modalType === 'reminder' ? 'reminder' : 'deadline'}...`}

            />
            <ModalButtonsCalendar>
              <ModalButtonCalendar cancel onClick={() => setModalOpen(false)}>
                Cancel
              </ModalButtonCalendar>
              <ModalButtonCalendar onClick={handleSave}>Save</ModalButtonCalendar>
            </ModalButtonsCalendar>
          </ModalContentCalendar>
        </ModalOverlayCalendar>
      )}
    </FullScreenCalendarContainer>
  );
};


//AI chatbot
const ChatContainer = styled.div`
  width: 100%;
  max-width: 600px;
  height: 500px;
  background: #1c1c3a;
  border: 2px solid cyan;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  overflow: hidden;
`;

const ChatHeader = styled.div`
  background: #2a1f42;
  padding: 15px;
  text-align: center;
  font-size: 1.5rem;
  color: #7df9ff;
  font-weight: bold;
`;

const ChatBody = styled.div`
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ChatFooter = styled.div`
  display: flex;
  padding: 10px;
  border-top: 1px solid cyan;
  background: #121212;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid cyan;
  border-radius: 5px;
  background: #121212;
  color: #fff;
  font-family: 'Poppins', sans-serif;
`;

const SendButton = styled.button`
  background: #7df9ff;
  color: #121212;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  margin-left: 10px;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    background: cyan;
  }
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 10px;
  border-radius: 10px;
  margin: 5px 0;
  background: ${(props) => (props.sender === 'user' ? '#7df9ff' : '#444')};
  color: ${(props) => (props.sender === 'user' ? '#121212' : '#fff')};
  align-self: ${(props) => (props.sender === 'user' ? 'flex-end' : 'flex-start')};
`;

// AI Chatbot component with API integration
const AIChatbot = () => {
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'ai', text: 'Hello! I am your AI assistant. How can I help you today?' },
  ]);
  const [userInput, setUserInput] = useState('');
  const chatBodyRef = useRef(null);

    // Scroll to bottom when new messages are added
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatMessages]);

    // Fetch response from Gemini AI API
  const fetchAIResponse = async (messageText) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: messageText }] }],
        }),
      });
      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error fetching AI response:', error);
      return "I'm sorry, I couldn't process your request. Please try again later.";
    }
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    const userMessage = { id: Date.now(), sender: 'user', text: userInput.trim() };
    setChatMessages((prev) => [...prev, userMessage]);
    setUserInput('');

    const tempAIMessage = { id: Date.now() + 1, sender: 'ai', text: '...' };
    setChatMessages((prev) => [...prev, tempAIMessage]);

    const aiReply = await fetchAIResponse(userMessage.text);
    setChatMessages((prev) =>
      prev.map((msg) => (msg.id === tempAIMessage.id ? { ...msg, text: aiReply } : msg))
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  return (
    <ChatContainer>
      <ChatHeader>AI Chatbot</ChatHeader>
      <ChatBody ref={chatBodyRef}>
        {chatMessages.map((msg) => (
          <MessageBubble key={msg.id} sender={msg.sender}>
            {msg.text}
          </MessageBubble>
        ))}
      </ChatBody>
      <ChatFooter>
        <ChatInput
          type="text"
          placeholder="Type your message..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <SendButton onClick={handleSendMessage}>Send</SendButton>
      </ChatFooter>
    </ChatContainer>
  );
};


//Styling
const FAQContainer = styled.div`
  width: 100%;
  padding: 20px;
  background: #1c1c3a;
  border-radius: 10px;
  margin-top: 20px;
`;

const FAQTitle = styled.h2`
  color: #fff;
  text-align: center;
  margin-bottom: 20px;
`;

const FAQItem = styled.div`
  margin-bottom: 15px;
`;

const FAQQuestion = styled.h3`
  color: #9966cc;
  margin: 0;
  font-size: 1.2rem;
`;

const FAQAnswer = styled.p`
  color: #fff;
  margin: 5px 0 0 0;
  font-size: 1rem;
`;

const PodcastContainer = styled.div`
  position: relative;
  display: inline-block;
  &:hover > div {
    display: block;
  }
`;


//Main page component
const Page = () => {
  const [enrolledCourses, setEnrolledCourses] = useState(() => {
    try {
      const saved = localStorage.getItem("enrolledCourses");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Error reading enrolledCourses:", error);
      return [];
    }
  });

  const [activeSection, setActiveSection] = useState('Dashboard');

    // Tracks learning activity over the past week
  const [learningActivity, setLearningActivity] = useState(() => {
    try {
      const saved = localStorage.getItem("learningActivity");
      if (saved) return JSON.parse(saved);
      const initial = {};
      for (let daysAgo = 6; daysAgo >= 0; daysAgo--) {
        const day = new Date();
        day.setDate(day.getDate() - daysAgo);
        initial[day.toLocaleDateString()] = 0;
      }
      return initial;
    } catch (error) {
      console.error("Error reading learningActivity:", error);
      const fallback = {};
      for (let daysAgo = 6; daysAgo >= 0; daysAgo--) {
        const day = new Date();
        day.setDate(day.getDate() - daysAgo);
        fallback[day.toLocaleDateString()] = 0;
      }
      return fallback;
    }
  });

    // Save enrolled courses to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("enrolledCourses", JSON.stringify(enrolledCourses));
    } catch (error) {
      console.error("Error saving enrolledCourses:", error);
    }
  }, [enrolledCourses]);

    // Update learning activity every minute
  useEffect(() => {
    const intervalId = setInterval(() => {
      const today = new Date().toLocaleDateString();
      setLearningActivity(prev => {
        const updated = { ...prev, [today]: (prev[today] || 0) + 1 / 60 };
        try {
          localStorage.setItem("learningActivity", JSON.stringify(updated));
        } catch (error) {
          console.error("Error saving learningActivity:", error);
        }
        return updated;
      });
    }, 60000);
    return () => clearInterval(intervalId);
  }, []);

    // Prepare data for activity chart
  const activityData = [];
  for (let daysAgo = 6; daysAgo >= 0; daysAgo--) {
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() - daysAgo);
    const key = dateObj.toLocaleDateString();
    activityData.push({
      date: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      hours: parseFloat((learningActivity[key] || 0).toFixed(2)),
    });
  }

  const yAxisTicks = [0.5, 1, 1.5, 2];

  const openCommunity = () => {
    window.open('https://www.reddit.com/r/stocks/', '_blank');
  };

  return (
    <>
      <GlobalStyle />
      <LeftWindow>
        <LearnTitle>LEARN</LearnTitle>
        <NavList>
          <NavItem onClick={() => setActiveSection('Dashboard')}>
            <FaTachometerAlt style={{ color: 'cyan' }} /> Dashboard
          </NavItem>
          <NavItem onClick={() => setActiveSection('My Courses')}>
            <FaBook style={{ color: 'cyan' }} /> My Courses
          </NavItem>
          <NavItem onClick={() => setActiveSection('Messages')}>
            <FaEnvelope style={{ color: 'cyan' }} /> Messages
          </NavItem>
          <NavItem onClick={() => setActiveSection('Calendar')}>
            <FaCalendarAlt style={{ color: 'cyan' }} /> Calendar
          </NavItem>
          <NavItem onClick={openCommunity}>
            <FaUsers style={{ color: 'cyan' }} /> Community
          </NavItem>
        </NavList>
      </LeftWindow>

      {activeSection !== 'My Courses' && (
        <RightContainer>
          <ChatBubble>Welcome back! Let's get started</ChatBubble>
          <InfoBoxesContainer>
            <PodcastContainer>
              <InfoBox 
                as="a" 
                href="https://theinvestorspodcast.com" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                  <FaPodcast size={24} style={{ color: '#39FF14' }} />
                  <InfoTitle>Podcast</InfoTitle>
                </div>
                <InfoDescription>
                  Listen to The Investor’s Podcast Network for expert financial insights.
                </InfoDescription>
              </InfoBox>
            </PodcastContainer>

            <InfoBox
              as="a"
              href="https://www.youtube.com/user/trading212"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                <FaVideo size={24} style={{ color: '#39FF14' }} />
                <InfoTitle>Video Tutorials</InfoTitle>
              </div>
              <InfoDescription>
                Videos that break down complex concepts into easy-to-understand lessons.
              </InfoDescription>
            </InfoBox>

            <InfoBox
              as="a"
              href="https://www.investopedia.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                <FaNewspaper size={24} style={{ color: '#39FF14' }} />
                <InfoTitle>Blogs and Articles</InfoTitle>
              </div>
              <InfoDescription>
                Learn about investment concepts and ideologies.
              </InfoDescription>
            </InfoBox>

            <InfoBox onClick={() => setActiveSection('FAQ')}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                <FaQuestionCircle size={24} style={{ color: '#39FF14' }} />
                <InfoTitle>FAQ</InfoTitle>
              </div>
              <InfoDescription>
                All the answers to your doubts &amp; queries.
              </InfoDescription>
            </InfoBox>
          </InfoBoxesContainer>
        </RightContainer>
      )}

      <CenterContainer>
        {activeSection === 'Dashboard' && (
          <>
            <DashboardHeader>Dashboard</DashboardHeader>
            <NewsBox>
              <RotatingLogo />
              <NewsTitle>New Courses</NewsTitle>
              <NewsItem>
                <strong>Types of Stocks (Common vs. Preferred)</strong>: Explore the differences and investment implications between common and preferred stocks.
              </NewsItem>
              <NewsItem>
                <strong>Economic and Industry Analysis</strong>: Learn to analyze market trends and industry performance for smarter investment decisions.
              </NewsItem>
              <NewsItem>
                <strong>Support and Resistance Levels</strong>: Understand key price points and chart patterns to enhance your trading strategy.
              </NewsItem>
              <NewsItem>
                <strong>Momentum Trading vs. Value Investing</strong>: Discover contrasting strategies to maximize returns based on market dynamics.
              </NewsItem>
            </NewsBox>
            <SectionHeader>Activity</SectionHeader>
            <div style={{ marginTop: '10px' }}>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="date" stroke="#fff" />
                  <YAxis
                    stroke="#fff"
                    tick={{ fill: '#fff' }}
                    ticks={yAxisTicks}
                    tickFormatter={(tick) => `${tick * 60} min`}
                    domain={[0.5, 2]}
                  />
                  <Tooltip
                    wrapperStyle={{ backgroundColor: '#f8f8f8', border: '1px solid cyan' }}
                    labelStyle={{ color: '#8e44ad' }}
                    itemStyle={{ color: '#8e44ad' }}
                    formatter={(value) => [`${(value * 60).toFixed(0)} min`, '']}
                  />
                  <Line type="monotone" dataKey="hours" stroke="#7df9ff" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <SectionHeader>My Current Courses</SectionHeader>
            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {enrolledCourses.map(course => {
                const progressPercent = Math.floor((course.completedUnits.length / course.topics.length) * 100);
                return (
                  <CourseCard key={course.id}>
                    <ProgressOverlay progress={progressPercent} />
                    <div style={{ zIndex: 1, flex: 1, textAlign: 'left' }}>{course.title}</div>
                    <div style={{ zIndex: 1, textAlign: 'right' }}>{progressPercent}%</div>
                  </CourseCard>
                );
              })}
            </div>
          </>
        )}

        {activeSection === 'My Courses' && (
          <MyCoursesSection 
            enrolledCourses={enrolledCourses} 
            setEnrolledCourses={setEnrolledCourses} 
          />
        )}
        {activeSection === 'Calendar' && <CalendarPage />}
        {activeSection === 'FAQ' && (
          <FAQContainer>
            <FAQTitle>Frequently Asked Questions</FAQTitle>
            <FAQItem>
              <FAQQuestion>How do I enroll in a course?</FAQQuestion>
              <FAQAnswer>
                Click on a course from the available courses sidebar to enroll. Once enrolled, it appears in your "My Courses" list. Click "Start Course" to view topics – each topic is locked until you click "Start" and complete its quiz.
              </FAQAnswer>
            </FAQItem>
            <FAQItem>
              <FAQQuestion>How do I contact support?</FAQQuestion>
              <FAQAnswer>
                You can reach our support team through the contact form available in the Settings section.
              </FAQAnswer>
            </FAQItem>
            <FAQItem>
              <FAQQuestion>Is there a free trial available?</FAQQuestion>
              <FAQAnswer>Yes, we offer a 7-day free trial for new users.</FAQAnswer>
            </FAQItem>
            <FAQItem>
              <FAQQuestion>What payment methods are accepted?</FAQQuestion>
              <FAQAnswer>We accept credit cards, PayPal, and other major options.</FAQAnswer>
            </FAQItem>
            <FAQItem>
              <FAQQuestion>How can I reset my password?</FAQQuestion>
              <FAQAnswer>
                You can reset your password via the Settings section or by clicking "Forgot Password" on the login page.
              </FAQAnswer>
            </FAQItem>
            <FAQItem>
              <FAQQuestion>What is technical analysis and how can it help me?</FAQQuestion>
              <FAQAnswer>
                It involves examining historical price and volume data to spot trends and patterns – helping traders make informed decisions.
              </FAQAnswer>
            </FAQItem>
            <FAQItem>
              <FAQQuestion>What is a stop-loss order and why is it important?</FAQQuestion>
              <FAQAnswer>
                A stop-loss order instructs a sale when a security hits a certain price, limiting potential losses.
              </FAQAnswer>
            </FAQItem>
            <FAQItem>
              <FAQQuestion>How do I choose stocks to invest in?</FAQQuestion>
              <FAQAnswer>
                Research is key—mix fundamental analysis, technical indicators, and market trends for a balanced approach.
              </FAQAnswer>
            </FAQItem>
            <BackButton onClick={() => setActiveSection('Dashboard')}>
              Back to Dashboard
            </BackButton>
          </FAQContainer>
        )}
        {activeSection === 'Messages' && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <AIChatbot />
          </div>
        )}
      </CenterContainer>
    </>
  );
};

export default Page;

              
