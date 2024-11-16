import React from 'react';
import styled, {keyframes} from "styled-components";


export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 70px;
  padding: 20px;
  max-width: 100%;
  background: linear-gradient(135deg, #e1f5fe 0%, #ffebee 100%);
  animation: ${fadeIn} 1s ease-in-out;
  overflow-x: hidden;
`;

const TransactionsPage = () => {
    return (
        <MainContainer>
            azazazazazazazazazazazazazazazazazazazazazaz

            
        </MainContainer>
    );
};

export default TransactionsPage;