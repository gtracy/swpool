import React from 'react';

import Event from './Event';
import { schedule } from '../schedule';


export default function Programming({activeDate}) {

    const day = schedule.fetchDay(activeDate);
    return(<div>
        {day.events.map( (e,index) => (
            <Event key={schedule.buildKey(e)} eventDetails={e} activeDate={activeDate} />
        ))}
    </div>)

}
