import React from 'react';

import { Card, CardContent, Typography } from '@mui/material';
import CampaignIcon from '@mui/icons-material/Campaign';

export default function Announcement() {

    return(
        <Card className="card" sx={{ border: '1px solid blue' }}>
            <CardContent style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5">
                    Announcements!
                </Typography>
                <CampaignIcon/>
            </CardContent>
        </Card>
    )
}