import React, {useState,useEffect} from 'react';

import Event from './Event';
import { schedule } from '../schedule';


const buildKey = (e) => {
    return(e[2]+e[3]+e[4]);
}

export default function Programming({activeDate}) {

    console.log('events for '+activeDate);
    const day = schedule.fetchDay(activeDate);
    console.dir(day);
    return(<div>
        {day.events.map( (e) => (
            <Event key={buildKey(e)} eventDetails={e} />
        ))}
    </div>)

}
