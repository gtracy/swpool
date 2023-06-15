import React from 'react';

import { Card, CardContent, Typography } from '@mui/material';

export default function Programming({activeDate}) {

    return(
    <Card className="card">
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Word of the Day
        </Typography>
        <Typography variant="h5" component="div">
          hey, greg. first card!
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          active date here
        </Typography>
        <Typography variant="body2">
          well meaning and kindly.
          <br />
          {'"a benevolent smile"'}
        </Typography>
      </CardContent>
    </Card>
    )

}
