import React from 'react';
import { makeStyles } from '@mui/styles';

import moment from 'moment';

import { Card, CardContent, Typography } from '@mui/material';
import CardIcon from './CardIcon';


const useStyles = makeStyles({
  announce: {
    border: '0.5px solid #d80032'
  },
  family: {
    border: '1px solid #a9bcd0',
  },
  open: {
    border: '1px solid #679436',
  },
  programming: {
    border: '1px solid #427aa1'
  },
  team: {
    border: '1px solid #0b3954'
  },
  old: {
    border: '1px dotted grey',
  },
  aerobics: {
    border: '1px solid #bb4430',
  },
  ballet: {
    border: '1px solid #ff6392'
  },
  oldCardContent: {
    padding: '0 !important',
    "&:last-child": {
      paddingBottom: '0 !important'
    }
  }
});

export default function Event({eventDetails, activeDate}) {
  const classes = useStyles();
  const className = classes[eventDetails.type];

  // determine if this event is already behind us today
  // const currentTime = moment();
  // const time = moment(eventDetails.end, 'hh:mm A');
  // const old = time.isBefore(currentTime);
  const currentTime = moment();
  const eventDateTime = moment(`${activeDate} ${eventDetails.end}`, 'YYYY-MM-DD hh:mm A');
  const old = eventDateTime.isBefore(currentTime);
  
  return(<div>
    {old 
      ?
        <Card className={"old card"}>
          <CardContent className={"oldCardContent"}>
            <Typography variant="body2">
              {eventDetails.description + ' was ' + eventDetails.start+'-'+eventDetails.end }
            </Typography>
          </CardContent>
        </Card>
      :
        <Card className={className + " card"}>
          <CardContent>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                {eventDetails.start + ' - ' + eventDetails.end}
              </Typography>
              <CardIcon type={eventDetails.type} />
            </div>

            <Typography variant="h5" component="div">
              {eventDetails.description}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {eventDetails.notes}
            </Typography>
          </CardContent>
        </Card>
    }
    </div>)

}
