import React from 'react';

import { Card, CardContent, Typography } from '@mui/material';

export default function Announcement() {

    return(
        <Card className="card">
            <CardContent>
                <Typography variant="h5">
                    Announcements!
                </Typography>
            </CardContent>
        </Card>
    )
}