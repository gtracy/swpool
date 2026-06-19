import React from 'react';
import moment from 'moment';

import Event from './Event';
import { schedule } from '../schedule';


export default function Programming({activeDate}) {

    const day = schedule.fetchDay(activeDate);

    // Partition events: active/upcoming first (in original order), then expired
    const now = moment();
    const active = [];
    const expired = [];

    day.events.forEach((e) => {
        const eventEnd = moment(`${activeDate} ${e.end}`, 'YYYY-MM-DD hh:mm A');
        if (eventEnd.isBefore(now)) {
            expired.push(e);
        } else {
            active.push(e);
        }
    });

    const sorted = [...active, ...expired];

    return(<div>
        {sorted.map( (e,index) => (
            <Event key={schedule.buildKey(e)} eventDetails={e} activeDate={activeDate} index={index} />
        ))}
    </div>)

}
