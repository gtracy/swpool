import ReactGA from 'react-ga4';
ReactGA.initialize('G-ETL4FMMKE5');

const buttonClick = (action) => ReactGA.event({
    category: "button click",
    action: action
})

const eventOccurred = (event) => ReactGA.event({
    category: "event occurred",
    action: event
})

const gaEvents = {
    buttonClick: buttonClick,
    eventOccurred: eventOccurred
}

export { gaEvents }