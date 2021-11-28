import { responsiveFontSizes } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import shadows from './shadows';
import { dark } from './palette';

const getTheme = (mode, themeToggler) =>
  responsiveFontSizes(
    createTheme({
      palette: dark,
      shadows: shadows(mode),
      typography: {
        fontFamily: '"Lato", sans-serif',
        button: {
          textTransform: 'none',
          fontWeight: 'medium',
        },
      },
      zIndex: {
        appBar: 1200,
        drawer: 1300,
      },
      components: {
        MuiButton: {
          styleOverrides: {
            label: {
              fontWeight: 600,
            },
            containedSecondary: mode === 'light' ? { color: 'white' } : {},
          },
        },
      },
      themeToggler,
    }),
  );

export default getTheme;
