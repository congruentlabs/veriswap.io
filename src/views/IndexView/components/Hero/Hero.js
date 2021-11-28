import React from 'react';
// import Typed from 'react-typed';
// import { LazyLoadImage } from 'react-lazy-load-image-component';
import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
// import useMediaQuery from '@mui/material/useMediaQuery';
// import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';

import Container from 'components/Container';

const Hero = () => {
  const theme = useTheme();
  // const { t } = useTranslation();
  // const isMd = useMediaQuery(theme.breakpoints.up('md'), {
  //   defaultMatches: true,
  // });

  return (
    <Box
      minHeight={800}
      height={'auto'}
      position={'relative'}
      // sx={{
      //   backgroundColor: theme.palette.alternate.main,
      //   background:
      //     'url(https://assets.maccarianagency.com/backgrounds/img19.jpg) no-repeat center',
      //   backgroundSize: 'cover',
      // }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: 1,
          height: 1,
          backgroundColor: theme.palette.background.default,
          // backgroundImage: `linear-gradient(315deg, ${theme.palette.background.default} 0%, #000000 74%)`,
          opacity: '0.8',
          zIndex: 1,
        }}
      />
      <Container position={'relative'} zIndex={2}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box width={1} height="100%" display="flex" alignItems="center">
              <Box
                component={Card}
                height={1}
                width={1}
                borderRadius={0}
                boxShadow={0}
                style={{ backgroundColor: theme.palette.background.default }}
              >
                <Box
                  component={CardMedia}
                  height={1}
                  width={1}
                  minHeight={300}
                  style={{ backgroundColor: theme.palette.background.default }}
                  image="logo-full.png"
                />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box width={1} height="100%" display="flex" alignItems="center">
              <Box
                padding={{ xs: 3, sm: 6 }}
                width={1}
                component={Card}
                borderRadius={2}
                boxShadow="rgb(100 221 23 / 60%) 0px 0px 31.25rem 1rem"
                // data-aos={'zoom-in'}
              >
                <form
                  noValidate
                  autoComplete="off"
                  // onSubmit={formik.handleSubmit}
                >
                  <Box display="flex" flexDirection={'column'}>
                    <Box marginBottom={4}>
                      <TextField
                        sx={{ height: 54 }}
                        label="From"
                        variant="outlined"
                        color="primary"
                        size="medium"
                        name="fullName"
                        fullWidth
                        // value={formik.values.fullName}
                        // onChange={formik.handleChange}
                        // error={
                        //   formik.touched.fullName && Boolean(formik.errors.fullName)
                        // }
                        // helperText={formik.touched.fullName && formik.errors.fullName}
                      />
                    </Box>
                    <Box marginBottom={4}>
                      <TextField
                        sx={{ height: 54 }}
                        label="To"
                        type="email"
                        variant="outlined"
                        color="primary"
                        size="medium"
                        name="email"
                        fullWidth
                        // value={formik.values.email}
                        // onChange={formik.handleChange}
                        // error={formik.touched.email && Boolean(formik.errors.email)}
                        // helperText={formik.touched.email && formik.errors.email}
                      />
                    </Box>
                    <Box marginBottom={4}>
                      <TextField
                        sx={{ height: 54 }}
                        label="Right"
                        type="password"
                        variant="outlined"
                        color="primary"
                        size="medium"
                        name="password"
                        fullWidth
                        // value={formik.values.password}
                        // onChange={formik.handleChange}
                        // error={
                        //   formik.touched.password && Boolean(formik.errors.password)
                        // }
                        // helperText={formik.touched.password && formik.errors.password}
                      />
                    </Box>
                    <Box>
                      <Button
                        sx={{ height: 54 }}
                        variant="contained"
                        color="primary"
                        size="medium"
                        style={{ fontWeight: 900 }}
                        fullWidth
                        type="submit"
                      >
                        SWAP
                      </Button>
                    </Box>
                    <Box marginY={4} marginX={{ xs: -3, sm: -6 }}>
                      <Divider />
                    </Box>
                    <Box>
                      <Typography component="p" variant="body2" align="left">
                        By using Veriswap you agree to our{' '}
                        <Box
                          component="a"
                          href=""
                          color={theme.palette.text.primary}
                          fontWeight={'700'}
                        >
                          Privacy Policy
                        </Box>
                        {' '}and{' '}
                        <Box
                          component="a"
                          href=""
                          color={theme.palette.text.primary}
                          fontWeight={'700'}
                        >
                          Terms &amp; Conditions
                        </Box>
                        .
                      </Typography>
                    </Box>
                  </Box>
                </form>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;
