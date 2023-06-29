import ReactGA from 'react-ga4';

const DEV_SWITCH = false;
ReactGA.initialize('G-ETL4FMMKE5');

const buttonClick = (action) => {
    if( !DEV_SWITCH ) {
        ReactGA.event({
            category: "button click",
            action: action
        })
    }
};

const eventOccurred = (event) => {
    if( !DEV_SWITCH ) {
        ReactGA.event({
            category: "event occurred",
            action: event
        })
    }
}

const gaEvents = {
    buttonClick: buttonClick,
    eventOccurred: eventOccurred
}

export { gaEvents }