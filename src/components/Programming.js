import React, {useState,useEffect} from 'react';

import Event from './Event';


const buildKey = (e) => {
    return(e[2]+e[3]+e[4]);
}

export default function Programming({events}) {

    console.log(events);

    return(<div>
        {events.map( (e) => (
            <Event key={buildKey(e)} eventDetails={e} />
        ))}
    </div>)

}
