import React, { useEffect } from 'react';
import dayjs from 'dayjs';
import moment from 'moment';

import { useState } from 'react';

import { AppBar, Box, Toolbar, Typography, Chip } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LinearProgress } from '@mui/material';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import InstallPWA from '../components/InstallPWA';
import { MobileDatePicker } from '@mui/x-date-pickers';

import Programming from '../components/Programming';

import { gaEvents } from '../analytics';
import { schedule } from '../schedule';

import PoolIcon from '@mui/icons-material/Pool';

const theme = createTheme({
    palette: {
        primary: {
            main: '#0891B2',
            dark: '#155E75',
        },
        secondary: {
            main: '#F59E0B',
        },
    },
    typography: {
        fontFamily: '"source-sans-pro","Source Sans Pro","Helvetica Neue",Helvetica,Arial,sans-serif',
        h5: {
            fontFamily: '"Nunito", sans-serif',
            fontWeight: 700,
        },
        h6: {
            fontFamily: '"Nunito", sans-serif',
            fontWeight: 700,
        },
    },
});

/* ── Decorative wave SVGs ── */
const WaveBottom = () => (
    <Box sx={{
        position: 'fixed',
        top: 72,
        left: 0, right: 0,
        zIndex: 1099,
        lineHeight: 0,
        pointerEvents: 'none',
    }}>
        <svg viewBox="0 0 1440 36" preserveAspectRatio="none"
             style={{ display: 'block', width: '100%', height: '36px' }}>
            <path
                d="M0,0 L0,18 Q360,36 720,18 Q1080,0 1440,18 L1440,0 Z"
                fill="#155E75"
            />
        </svg>
    </Box>
);

const WaveTop = () => (
    <Box sx={{
        position: 'fixed',
        bottom: 48,
        left: 0, right: 0,
        zIndex: 1099,
        lineHeight: 0,
        pointerEvents: 'none',
    }}>
        <svg viewBox="0 0 1440 28" preserveAspectRatio="none"
             style={{ display: 'block', width: '100%', height: '28px' }}>
            <path
                d="M0,28 L0,14 Q360,0 720,14 Q1080,28 1440,14 L1440,28 Z"
                fill="#155E75"
            />
        </svg>
    </Box>
);

export default function SWPool() {
    const today = moment().isBetween('2026-05-30', '2026-09-01', undefined, '[]')
        ? moment().format('YYYY-MM-DD')
        : '2026-05-30';

    const [activeDate, setActiveDate] = useState(today);
    const [loading,setLoading] = useState(true);
    const [dateLabel,setDateLabel] = useState(moment(today).format('dddd').toLocaleLowerCase())

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
    },[activeDate, loading])

    function datePicked(newDate) {
        setActiveDate(dayjs(newDate).format('YYYY-MM-DD'));
        setDateLabel(dayjs(newDate).format('dddd').toLocaleLowerCase());
    }

    return(
        <ThemeProvider theme={theme}>

        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

            {/* ── Header ── */}
            <AppBar
                position="fixed"
                elevation={0}
            >
                <Toolbar sx={{
                    background: 'linear-gradient(135deg, #0891B2 0%, #155E75 100%)',
                    padding: 2,
                    margin: 0,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    {/* Branding */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PoolIcon sx={{ color: 'rgba(255,255,255,0.85)', fontSize: 28 }} />
                        <Typography
                            variant="h6"
                            sx={{
                                color: 'white',
                                letterSpacing: '0.5px',
                                display: { xs: 'none', sm: 'block' },
                            }}
                        >
                            SWPool
                        </Typography>
                    </Box>

                    {/* Date picker */}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MobileDatePicker
                            label={dateLabel}
                            defaultValue={dayjs(activeDate)}
                            onChange={datePicked}
                            closeOnSelect={true}
                            minDate={dayjs("2026-05-30")}
                            maxDate={dayjs("2026-09-01")}
                            sx={{
                                '& .MuiInputBase-root': {
                                    color: 'white',
                                    fontFamily: '"Nunito", sans-serif',
                                    fontWeight: 700,
                                    fontSize: '1.05rem',
                                    borderRadius: '12px',
                                    backgroundColor: 'rgba(255,255,255,0.12)',
                                    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.6)' },
                                    '&.Mui-focused fieldset': { borderColor: 'white' },
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'rgba(255,255,255,0.75)',
                                    fontFamily: '"Nunito", sans-serif',
                                    fontWeight: 600,
                                    textTransform: 'capitalize',
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: 'white',
                                },
                                '& .MuiSvgIcon-root': {
                                    color: 'rgba(255,255,255,0.7)',
                                },
                            }}
                        />
                    </LocalizationProvider>
                </Toolbar>
            </AppBar>

            <WaveBottom />

            {/* ── Content ── */}
            {loading ? (
                <LinearProgress
                    color="secondary"
                    sx={{ position: 'fixed', top: 72, left: 0, right: 0, zIndex: 1200 }}
                />
            ) : (
                <Box sx={{
                    flexGrow: 1,
                    maxHeight: '92vh',
                    overflowY: 'auto',
                    paddingTop: '116px',
                    paddingBottom: '80px',
                }}>
                    <Programming activeDate={activeDate} />
                </Box>
            )}

            {/* ── Footer ── */}
            <WaveTop />
            <AppBar
                position="fixed"
                elevation={0}
                sx={{ top: 'auto', bottom: 0 }}
            >
                <Toolbar
                    variant="dense"
                    sx={{
                        background: 'linear-gradient(135deg, #155E75 0%, #0891B2 100%)',
                        padding: 0,
                        paddingLeft: 1.5,
                        paddingRight: 1,
                        margin: 0,
                        justifyContent: 'space-between',
                    }}
                >
                    <Typography variant="subtitle2" sx={{ '& a': { color: '#FFF8E1', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } } }}>
                      <a href="mailto:feedback@swpool.org?subject=SWPool feedback">feedback</a> <span>&#x1F64F;</span>
                    </Typography>

                    <InstallPWA/>
                </Toolbar>
            </AppBar>
      </div>
      </ThemeProvider>
    )

}
