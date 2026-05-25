import { Outlet, Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Box, Container, IconButton, Stack, Button, Divider, Typography, Link } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useColorMode } from '../colorMode.js';

export default function Main() {
  const { mode, toggle } = useColorMode();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit', fontWeight: 700 }}
          >
            Veriswap
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button component={RouterLink} to="/" color="inherit">Swap</Button>
            <Button component={RouterLink} to="/wrap" color="inherit">Wrap</Button>
            <IconButton onClick={toggle} color="inherit" aria-label="toggle theme">
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            <ConnectButton showBalance={false} chainStatus="icon" accountStatus="address" />
          </Stack>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flex: 1, py: { xs: 3, md: 6 } }}>
        <Container maxWidth="md">
          <Outlet />
        </Container>
      </Box>

      <Divider />
      <Box component="footer" sx={{ py: 3 }}>
        <Container maxWidth="md">
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={1}>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Congruent Labs Pty Ltd
            </Typography>
            <Stack direction="row" spacing={2}>
              <Link href="https://signata.net" target="_blank" rel="noopener" underline="hover">Signata Manager</Link>
              <Link component={RouterLink} to="/wrap" underline="hover">Wrap</Link>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
