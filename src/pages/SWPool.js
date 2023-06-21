import React, { useEffect } from 'react';
import dayjs from 'dayjs';

import { useState } from 'react';

import { makeStyles } from '@mui/styles';

import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LinearProgress } from '@mui/material';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import InstallPWA from '../components/InstallPWA';
import { MobileDatePicker } from '@mui/x-date-pickers';

import Programming from '../components/Programming';
import Announcement from '../components/Announcement';

import { gaEvents } from '../analytics';
import { getSheetData } from '../google';

const theme = createTheme({

});

const useStyles = makeStyles({
    containerDetails: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default function SWPool() {
    const classes = useStyles();

    const [activeDate, setActiveDate] = useState(new Date());
    const [events,setEvents] = useState([]);
    const [loading,setLoading] = useState(true);

    useEffect( () => {
        setLoading(true);
        gaEvents.eventOccurred('load sheet');
        getSheetData()
          .then(result => {
            setEvents(result);
            console.log('Events loaded! ' + result.length);
          })
          .catch(error => {
            console.error("error loading arrival data");
            gaEvents.eventOccurred('sheet load failed');
          })
          .finally(() => {
            setLoading(false);
          });
    },[activeDate])

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

            {loading ? (
                <LinearProgress className={classes.containerDetails}/>
            ) : (
                <Box sx={{ flexGrow: 1, maxHeight:'92vh',overflowY: 'auto', paddingTop: '70px' }}>
                    <Announcement/>
                    {console.log('pass down events, '+events.length)}
                    <Programming events={events} />
                </Box>
            )}

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

