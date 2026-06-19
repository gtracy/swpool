import React from 'react';
import moment from 'moment';

import { Card, CardContent, Typography, Chip, Box } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CardIcon from './CardIcon';

/* ── Event-type color map ── */
const EVENT_COLORS = {
  open:        { accent: '#679436', bg: 'rgba(103,148,54,0.07)',  shadow: 'rgba(103,148,54,0.18)' },
  family:      { accent: '#5B9BD5', bg: 'rgba(91,155,213,0.07)',  shadow: 'rgba(91,155,213,0.18)' },
  team:        { accent: '#0B3954', bg: 'rgba(11,57,84,0.07)',    shadow: 'rgba(11,57,84,0.18)' },
  programming: { accent: '#427AA1', bg: 'rgba(66,122,161,0.07)',  shadow: 'rgba(66,122,161,0.18)' },
  aerobics:    { accent: '#BB4430', bg: 'rgba(187,68,48,0.07)',   shadow: 'rgba(187,68,48,0.18)' },
  ballet:      { accent: '#FF6392', bg: 'rgba(255,99,146,0.07)', shadow: 'rgba(255,99,146,0.18)' },
  announce:    { accent: '#D80032', bg: 'rgba(216,0,50,0.07)',    shadow: 'rgba(216,0,50,0.18)' },
};

const DEFAULT_COLOR = { accent: '#999', bg: 'rgba(150,150,150,0.06)', shadow: 'rgba(150,150,150,0.12)' };

export default function Event({eventDetails, activeDate, index = 0}) {
  const colors = EVENT_COLORS[eventDetails.type] || DEFAULT_COLOR;

  /* ── Time checks ── */
  const currentTime = moment();
  const eventStart = moment(`${activeDate} ${eventDetails.start}`, 'YYYY-MM-DD hh:mm A');
  const eventEnd   = moment(`${activeDate} ${eventDetails.end}`,   'YYYY-MM-DD hh:mm A');
  const old   = eventEnd.isBefore(currentTime);
  const isNow = currentTime.isBetween(eventStart, eventEnd, undefined, '[)');

  /* ── Staggered animation delay ── */
  const animDelay = `${index * 0.06}s`;

  /* ── Past event (collapsed) ── */
  if (old) {
    return (
      <Card
        className="card card-animate"
        style={{ animationDelay: animDelay }}
        sx={{
          opacity: 0.45,
          backgroundColor: 'rgba(255,255,255,0.5)',
          backdropFilter: 'blur(4px)',
          borderLeft: `3px solid #bbb`,
          boxShadow: 'none',
        }}
      >
        <CardContent sx={{ py: 1, px: 2, '&:last-child': { pb: 1 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CardIcon type={eventDetails.type} color="#999" />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              <span style={{ textDecoration: 'line-through', marginRight: 6 }}>
                {eventDetails.start}–{eventDetails.end}
              </span>
              {eventDetails.description}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  /* ── Active / upcoming event ── */
  return (
    <Card
      className={`card card-animate ${isNow ? 'card-now' : ''}`}
      style={{ animationDelay: animDelay }}
      sx={{
        position: 'relative',
        backgroundColor: colors.bg,
        backdropFilter: 'blur(8px)',
        borderLeft: `4px solid ${colors.accent}`,
        boxShadow: `0 2px 12px ${colors.shadow}`,
        ...(isNow && {
          borderLeft: `5px solid ${colors.accent}`,
          boxShadow: `0 4px 20px ${colors.shadow}`,
          backgroundColor: colors.bg.replace('0.07', '0.13'),
        }),
      }}
    >
      <CardContent sx={{ py: 1.5, px: 2 }}>
        {/* Time row + icon */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              size="small"
              label={`${eventDetails.start} - ${eventDetails.end}`}
              sx={{
                fontFamily: '"source-sans-pro", sans-serif',
                fontWeight: 600,
                fontSize: '0.82rem',
                backgroundColor: `${colors.accent}18`,
                color: colors.accent,
                borderRadius: '8px',
                height: 26,
              }}
            />
            {isNow && (
              <Chip
                icon={<AccessTimeIcon sx={{ fontSize: 15, color: '#0891B2 !important' }} />}
                size="small"
                label="now"
                sx={{
                  fontFamily: '"Nunito", sans-serif',
                  fontWeight: 700,
                  fontSize: '0.76rem',
                  backgroundColor: 'rgba(8,145,178,0.12)',
                  color: '#0891B2',
                  borderRadius: '8px',
                  height: 26,
                }}
              />
            )}
          </Box>
          <CardIcon type={eventDetails.type} color={colors.accent} />
        </Box>

        {/* Title */}
        <Typography
          variant="h5"
          component="div"
          sx={{ fontSize: '1.15rem', mt: 0.5, lineHeight: 1.3 }}
        >
          {eventDetails.description}
        </Typography>

        {/* Notes */}
        {eventDetails.notes && (
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', mt: 0.5, lineHeight: 1.4 }}
          >
            {eventDetails.notes}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
