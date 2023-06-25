import React from 'react';

import { Card, CardContent, Typography } from '@mui/material';

export default function Event({eventDetails}) {

    return(
    <Card className="card">
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {eventDetails.dow}
        </Typography>
        <Typography variant="h5" component="div">
          {eventDetails.description}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {eventDetails.start + ' - ' + eventDetails.end}
        </Typography>
        <Typography variant="body2">
            {eventDetails.notes}
        </Typography>
      </CardContent>
    </Card>
    )

}
