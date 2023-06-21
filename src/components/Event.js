import React from 'react';

import { Card, CardContent, Typography } from '@mui/material';

export default function Event({eventDetails}) {

    return(
    <Card className="card">
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {eventDetails[0]}
        </Typography>
        <Typography variant="h5" component="div">
          {eventDetails[4]}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {eventDetails[2] + ' - ' + eventDetails[3]}
        </Typography>
        <Typography variant="body2">
            {eventDetails[5]}
        </Typography>
      </CardContent>
    </Card>
    )

}
