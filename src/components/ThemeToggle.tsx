import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '../context/ThemeContext';

interface StyledIconButtonProps {
  selected?: boolean;
}

const ToggleContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f4f4f4',
  borderRadius: 20,
  padding: '3px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
}));

const StyledIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<StyledIconButtonProps>(({ theme, selected }) => ({
  backgroundColor: selected ? (theme.palette.mode === 'dark' ? '#333' : '#ffffff') : 'transparent',
  color: theme.palette.mode === 'dark' ? '#fff' : '#000',
  transition: 'all 0.3s',
}));

const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <ToggleContainer>
        <StyledIconButton
          selected={isDarkMode}
          onClick={() => !isDarkMode && toggleTheme()}
        >
          <Brightness4Icon sx={{ color: isDarkMode ? "#fff" : "#aaa" }} />
        </StyledIconButton>
        <StyledIconButton
          selected={!isDarkMode}
          onClick={() => isDarkMode && toggleTheme()}
        >
          <Brightness7Icon sx={{ color: !isDarkMode ? "#555" : "#aaa" }} />
        </StyledIconButton>
      </ToggleContainer>
    </Box>
  );
};

export default ThemeToggle;
