import { createTheme } from '@mui/material/styles';

export const buildTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: { main: '#64dd17' },
      secondary: { main: '#7c4dff' },
      background:
        mode === 'dark'
          ? { default: '#101120', paper: '#1a1c2e' }
          : { default: '#f4f6fb', paper: '#ffffff' }
    },
    typography: {
      fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 700 },
      button: { textTransform: 'none', fontWeight: 700 }
    },
    shape: { borderRadius: 10 },
    components: {
      MuiButton: { defaultProps: { disableElevation: true } },
      MuiCard: { styleOverrides: { root: { borderRadius: 12 } } }
    }
  });
