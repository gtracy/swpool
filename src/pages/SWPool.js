import React from 'react';

import { AppBar, Box, Toolbar, Typography } from '@mui/material';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import InstallPWA from '../components/InstallPWA';


const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#1f355a',
      },
      secondary: {
        main: '#BDF7C1',
      },
      background: {
        default: '#1f355a',
      },
      error: {
        main: '#c6d21a',
      },
      text: {
        primary: '#f0ebd8',//#ffebee',
        secondary: '#ffebee', //'#81f786',
        disabled: 'rgba(241,166,166,0.38)',
        hint: '#f7e22e',
      },
      },
    typography: {
      h1: {
        fontSize: '8.2rem',
        fontWeight: 700,
        lineHeight: 0.75,
        paddingTop: '16px'
      },
    },
});

export default function SWPool() {

    return(
        <ThemeProvider theme={theme}>

        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

            <AppBar 
                position="fixed"
                elevation={0}
            >
                <Toolbar sx={{ padding:0, margin:0,justifyContent: 'space-between' }}>
                </Toolbar>
            </AppBar>

            <Box sx={{ flexGrow: 1, maxHeight:'92vh',overflowY: 'auto', paddingTop: '70px' }}>
              hi, greg
            </Box>

            <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
                <Toolbar 
                    variant="dense"
                    sx={{ padding:0, paddingLeft:1, margin:0,justifyContent: 'space-between' }}
                >
                    <Typography variant="subtitle2">
                     <a href="mailto:feedback+swpool@madisonbus.org?subject=MadTransit feedback">feedback</a> <span>&#x1F64F;</span>
                    </Typography>

                    <InstallPWA/>
                </Toolbar>
            </AppBar>
      </div>
      </ThemeProvider>
    )

}

