import React, { useEffect } from 'react';
import dayjs from 'dayjs';
import moment from 'moment';

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
import { schedule } from '../schedule';

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
    const today = moment().format('YYYY-MM-DD');

    const [activeDate, setActiveDate] = useState(today);
    const [loading,setLoading] = useState(true);
    const [dateLabel,setDateLabel] = useState(moment().format('dddd').toLocaleLowerCase())

    useEffect( () => {
        if( loading === true ) {
            console.log('active: '+moment(activeDate).format('YYYY-MM-DD'));

            setDateLabel(moment(activeDate).format('dddd').toLocaleLowerCase());
            gaEvents.eventOccurred('load sheet');

            schedule.loadSchedule()
            .then(result => {
                // no-op
            })
            .catch(error => {
                console.error("error loading arrival data");
                console.dir(error);
                gaEvents.eventOccurred('sheet load failed');
            })
            .finally(() => {
                setLoading(false);
            });
        }
    },[activeDate])

    function datePicked(newDate) {
        setActiveDate(dayjs(newDate).format('YYYY-MM-DD'));
        setDateLabel(dayjs(newDate).format('dddd').toLocaleLowerCase());
    }

    return(
        <ThemeProvider theme={theme}>

        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

            <AppBar 
                position="fixed"
                elevation={2}
            >
                <Toolbar sx={{ backgroundColor: 'white', padding:2, margin:0, justifyContent: 'space-between' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MobileDatePicker
                            label={dateLabel}
                            defaultValue={dayjs(activeDate)} 
                            onChange={datePicked} 
                            closeOnSelect={true}
                            minDate={dayjs("2023-06-10")}
                            maxDate={dayjs("2023-08-31")}
                        />
                    </LocalizationProvider>
                </Toolbar>
            </AppBar>

            {loading ? (
                <LinearProgress className={classes.containerDetails}/>
            ) : (
                <Box sx={{ flexGrow: 1, maxHeight:'92vh',overflowY: 'auto', paddingTop: '100px' }}>
                        {/* <Announcement/> */}
                        <Programming activeDate={activeDate} />
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

