'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  cssVariables: {
    cssVarPrefix: 'mui',
    colorSchemeSelector: 'class',
  },
  palette: {
    primary: {
      main: '#C9A449',
      dark: '#8C6F2A',
      light: '#D4B76A',
      contrastText: '#0E0E0E',
    },
    secondary: {
      main: '#0E0E0E',
      light: '#1C1C1C',
      contrastText: '#FAFAF7',
    },
    error: {
      main: '#E84855',
    },
    warning: {
      main: '#F2994A',
    },
    success: {
      main: '#50C878',
    },
    info: {
      main: '#4A90E2',
    },
    background: {
      default: '#FAFAF7',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0E0E0E',
      secondary: '#6B6B6B',
    },
    divider: '#E6E6E6',
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: {
      fontSize: '1.875rem',
      fontWeight: 400,
      color: '#0E0E0E',
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 400,
      color: '#0E0E0E',
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 500,
      color: '#0E0E0E',
    },
    body1: {
      fontSize: '0.875rem',
      color: '#0E0E0E',
    },
    body2: {
      fontSize: '0.875rem',
      color: '#6B6B6B',
    },
    caption: {
      fontSize: '0.75rem',
      color: '#6B6B6B',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
        },
        contained: {
          '&:hover': {
            backgroundColor: '#8C6F2A',
            color: '#FFFFFF',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #E6E6E6',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          fontSize: '0.75rem',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#FAFAF7',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          color: '#6B6B6B',
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          fontWeight: 600,
          letterSpacing: '0.05em',
          borderBottom: '1px solid #E6E6E6',
        },
        body: {
          borderBottom: '1px solid #E6E6E6',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#FAFAF7',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#C9A449',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#C9A449',
            },
          },
        },
      },
    },
    MuiSelect: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#0E0E0E',
          fontSize: '0.75rem',
        },
      },
    },
  },
});

export default theme;
