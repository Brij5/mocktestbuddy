import React from 'react';
import { styled } from '@mui/material/styles';


const StyledButton = styled('button')(() => ({
  padding: '8px 16px',
  backgroundColor: '#1976d2',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  '&:hover': {
    backgroundColor: '#1565c0',
  },
  '&:disabled': {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  },
}));

const CustomButton = ({ children, onClick, disabled, fullWidth, ...props }) => {
  return (
    <StyledButton
      onClick={onClick}
      disabled={disabled}
      style={{ width: fullWidth ? '100%' : 'auto' }}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default CustomButton;
