
import styled from 'styled-components';

export const HorizontalBar = styled.div`
  position: fixed;
  top: 15%;
  left: 0;
  width: 100%;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: center;
`;

export const TimeFrameSelector = styled.select`
  background: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 5px;
  border: none;
  border-radius: 5px;
  font-size: 0.9rem;
  margin-left: 10px;
  
  &:focus {
    outline: none;
    box-shadow: 0px 0px 8px rgba(0, 212, 255, 0.8);
  }

  option {
    background-color: rgba(50, 50, 50, 1); /* Ensures contrast against white text */
    color: white; /* Keep text visible */
    padding: 10px;
  }
`;

export const AccountNumber = styled.div`
  font-size: 1rem;
  color: white;
  font-weight: bold;
`;

export const AvailableFunds = styled.div`
  font-size: 0.9rem;
  color: white;
`;


export const AddButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  font-size: 0.9rem;
  cursor: pointer;
  margin-left: 5px;
  box-shadow: 0px 4px 8px rgba(76, 175, 80, 0.3);
  transition: all 0.3s ease;

  &:hover {
    background-color: #388e3c;
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: #8e8e8e;
    cursor: not-allowed;
  }
`;

export const SideWindow = styled.div`
  position: fixed;
  top: 20%;
  width: 20%;
  height: 80%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 20px;
  overflow-y: auto;
`;

export const LeftWindow = styled(SideWindow)`
  left: 0;
  margin-right: 5px;
  background: linear-gradient(135deg, #222844, #2a1f42);
  color: #ffffff;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 15px;
  font-size: 0.9rem;
`;

export const RightWindow = styled(SideWindow)`
  right: 0;
  margin-left: 5px;
  background: linear-gradient(135deg, #1f1f2e, #2e294b);
  color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.3);
  overflow-y: auto;
  font-family: 'Arial, sans-serif';
`;

export const SummaryContainer = styled.div`
  margin-top: 20px;
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 10px;
  box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.3);
`;

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

export const SummaryText = styled.span`
  color: #ffffff;
`;

export const CenterContainer = styled.div`
  position: fixed;
  top: 20%;
  left: calc(20% + 5px);
  width: calc(60% - 10px);
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: none;
  pointer-events: none;
`;

export const TopWindow = styled.div`
  flex: 2;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 10px;
  pointer-events: all;
`;

export const BottomWindow = styled.div`
  flex: 2;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 20px;
  margin-top: 5px;
  pointer-events: all;
`;

export const StockListItem = styled.li`
  cursor: pointer;
  padding: 8px;
  border-radius: 5px;
  transition: all 0.3s ease-in-out;
  background-color: ${(props) => (props.selected ? 'rgba(0, 212, 255, 0.3)' : 'transparent')};

  &:hover {
    background-color: rgba(0, 212, 255, 0.15);
  }
`;

export const FormLabel = styled.label`
  color: #ffffff;
  margin-bottom: 5px;
  font-weight: bold;
`;

export const InputField = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border-radius: 5px;
  border: none;
  outline: none;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: inset 1px 2px 5px rgba(0, 0, 0, 0.3);

  &:focus {
    outline: none;
    box-shadow: 0px 0px 8px rgba(0, 212, 255, 0.8);
  }

  &::placeholder {
    color: #d3d3d3;
  }
`;

export const SelectField = styled.select`
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border-radius: 5px;
  border: none;
  outline: none;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: inset 1px 2px 5px rgba(0, 0, 0, 0.3);

  &:focus {
    outline: none;
    box-shadow: 0px 0px 8px rgba(0, 212, 255, 0.8);
  }

  option {
    background-color: #1f1f2e;
    color: #ffffff;
    padding: 10px;
  }
`;

export const Button = styled.button`
  width: 48%;
  padding: 12px 20px;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  color: #ffffff;
  background: ${(props) => (props.$sell ? '#f44336' : '#4caf50')};
  box-shadow: 0px 5px 15px rgba(76, 175, 80, 0.5);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    background: ${(props) => (props.$sell ? '#d32f2f' : '#388e3c')};
  }
`;