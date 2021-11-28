/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import WarningIcon from '@mui/icons-material/Warning';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

const feats = [
  {
    title: 'Powered by Signata',
    subtitle:
      'Lorum Ipsum.',
    icon: <PrivacyTipIcon />,
  },
  {
    title: 'Risk Detection with Chainlink',
    subtitle:
      'Lorum Ipsum.',
    icon: <WarningIcon />,
  },
  {
    title: 'Multi-Currency Support',
    subtitle:
      'Lorum Ipsum.',
    icon: <SwapHorizIcon />,
  },
];

const Features = () => {
  const theme = useTheme();
  return (
    <Grid container spacing={4}>
      {feats.map((item, i) => (
        <Grid item xs={12} sm={6} md={4} key={i}>
          <Box
            component={Card}
            padding={4}
            borderRadius={4}
            width={1}
            height={1}
            data-aos={'fade-up'}
            data-aos-delay={i * 100}
          >
            <Box
              display={'flex'}
              flexDirection={'column'}
              alignItems="center"
            >
              <Box
                component={Avatar}
                width={50}
                height={50}
                marginBottom={2}
                alignItems="center"
                bgcolor={theme.palette.secondary.main}
                color={theme.palette.background.paper}
              >
                {item.icon}
              </Box>
              <Typography
                variant={'h6'}
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                {item.title}
              </Typography>
              {/* <Typography color="text.secondary">{item.subtitle}</Typography> */}
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default Features;
