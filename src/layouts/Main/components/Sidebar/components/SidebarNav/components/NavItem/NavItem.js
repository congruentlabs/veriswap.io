import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

const NavItem = ({ title, items }) => {
  const theme = useTheme();
  const [activeLink, setActiveLink] = useState('');
  useEffect(() => {
    setActiveLink(window && window.location ? window.location.pathname : '');
  }, []);

  return (
    <Box>
      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{
          fontWeight: 700,
        }}
      >
        {title}
      </Typography>
      {items.map((item, i) => (
        <Box key={i} marginBottom={2}>
          <Typography
            variant="caption"
            color="primary"
            gutterBottom
            sx={{
              fontWeight: 700,
              textTransform: 'uppercase',
              display: 'block',
            }}
          >
            {item.groupTitle}
          </Typography>
          <Grid container>
            {item.pages.map((p, i) => (
              <Grid item xs={6} key={i}>
                <Link
                  variant="body2"
                  component={'a'}
                  href={p.href}
                  color={activeLink === p.href ? 'primary' : 'text.primary'}
                  sx={{
                    fontWeight: activeLink === p.href ? 600 : 400,
                    textDecoration: 'none',
                    '&:hover': {
                      color: theme.palette.primary.dark,
                    },
                  }}
                >
                  {p.title}
                </Link>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

NavItem.propTypes = {
  items: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func,
};

export default NavItem;
