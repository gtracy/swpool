import React from 'react';
import dayjs from 'dayjs';

import { useState } from 'react';

import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import InstallPWA from '../components/InstallPWA';
import { MobileDatePicker } from '@mui/x-date-pickers';

import Programming from '../components/Programming';

const theme = createTheme({

});

export default function SWPool() {
    const [activeDate, setActiveDate] = useState(new Date());

    return(
        <ThemeProvider theme={theme}>

        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

            <AppBar 
                position="fixed"
                elevation={0}
            >
                <Toolbar sx={{ padding:0, margin:0,justifyContent: 'space-between' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MobileDatePicker defaultValue={dayjs(activeDate)}/>
                </LocalizationProvider>
                </Toolbar>
            </AppBar>

            <Box sx={{ flexGrow: 1, maxHeight:'92vh',overflowY: 'auto', paddingTop: '70px' }}>
                <Programming activeDate={activeDate} />
            </Box>

            <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
                <Toolbar 
                    variant="dense"
                    sx={{ padding:0, paddingLeft:1, margin:0,justifyContent: 'space-between' }}
                >
                    <Typography variant="subtitle2">
                     <a href="mailto:feedback@swpool.org?subject=MadTransit feedback">feedback</a> <span>&#x1F64F;</span>
                    </Typography>

                    <InstallPWA/>
                </Toolbar>
            </AppBar>
      </div>
      </ThemeProvider>
    )

}

