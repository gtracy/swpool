import { getSheetData } from './google';
import { gaEvents } from './analytics';
import moment from 'moment';

const GOOGLE_SHEET_ID = '1VyhQOIgUpf3apEzbghsGXZynNr1gYsopVuAAT4uo9B8';
const GOOGLE_SHEET_RANGE = [
    'May24-June8!A2:F100',
    'June9-June13',
    'June14-June29',
    'June30-July4',
    'July5-July27',
    'July28-August1',
    'August2-August31',
    'September1-September1'
  ];
  
class Schedule {

    #schedule = {};

    // raw sheet data is a two-dimensional array
    //
    // each event looks like this:
    //   [
    //     'friday',
    //     'open',
    //     '5:45 AM',
    //     '7:45 AM',
    //     'Adult lap swim',
    //     'long course. 1 lane.'
    //   ],
    //
    // the transformation will look like this:
    //   '2023-06-23' : {
    //       'dow' : 'friday',
    //       'events' : [
    //         'type' : 'open',
    //         'start' : '5:45 AM',
    //         'end' : '7:45 AM',
    //         'description' : 'Adult lap swim',
    //         'notes' : 'long course. 1 lane'
    //       ]
    //   }
    #transformSheetTab(rawData) {
        const rowValues = rawData.values;

        function getDaysBetweenDates(startDate, endDate) {
            const start = moment(startDate);
            const end = moment(endDate);
          
            // Calculate the difference in days using Moment.js duration
            const duration = moment.duration(end.diff(start));
            const diffInDays = duration.asDays()+1;
          
            return Math.round(diffInDays);
        }
          
        // the range is a tab name: 
        //   "'June10-July2'!A2:F73"
        function extractDatesFromString(str) {
            const regex = /'(\w+\d+)-(\w+\d+)'!/;
            const matches = str.match(regex);
          
            if (matches && matches.length >= 3) {
              const startDate = moment(matches[1], 'MMMDD').format('YYYY-MM-DD');
              const endDate = moment(matches[2], 'MMMDD').format('YYYY-MM-DD');

              const days = getDaysBetweenDates(startDate,endDate);

              return { startDate, endDate, days };
            }
          
            return null; // or handle the case where the format doesn't match
        }

        function setScheduleProperty(value,defaultValue) {
            if( value && value.length === 0 ) {
                return defaultValue;
            } else {
                return value;
            }
        }

        //console.log(rawData.range);
        const {startDate,endDate,days} = extractDatesFromString(rawData.range);
        //console.log(startDate,endDate,days);
        for( let i=0; i < days; i++ ) {
            const currentDate = moment(startDate).add(i, 'days');
            const formattedDate = currentDate.format('YYYY-MM-DD');
            const dayOfWeek = moment(formattedDate).format('dddd').toLocaleLowerCase();
            
            // no matter the circumstances, reset the date
            this.#schedule[formattedDate] = {events:[]};

            rowValues.forEach((row) => {
                if( row[0] === dayOfWeek ) {
                    this.#schedule[formattedDate].events.push({
                        'dow' : dayOfWeek,
                        'type' : setScheduleProperty(row[1],'open'),
                        'start' : setScheduleProperty(row[2],''),
                        'end' : setScheduleProperty(row[3],''),
                        'description' : setScheduleProperty(row[4],''),
                        'notes' : setScheduleProperty(row[5],''),
                    });
                }
            });

            // Sort the events based on the "start" time property
            this.#schedule[formattedDate].events.sort((a, b) => {
                const startTimeA = moment(a.start, 'hh:mm A');
                const startTimeB = moment(b.start, 'hh:mm A');

                // Compare the start times
                if (startTimeA < startTimeB) {
                    return -1;
                }
                if (startTimeA > startTimeB) {
                    return 1;
                }
                return 0;
            });        }
        
    }

    async loadSchedule() {
        gaEvents.eventOccurred('load sheet');

        try{ 
            const promises = GOOGLE_SHEET_RANGE.map(range => getSheetData(GOOGLE_SHEET_ID, range));
            const results = await Promise.all(promises);

            // results is a list of Sheets API data for each tab
            // loop over the results, and transform each chunk
            results.forEach((result) => {
                this.#transformSheetTab(result);
            })
            console.log('transformed results... ' + Object.keys(this.#schedule).length);
            return(this.#schedule);
        } catch (error) {
            console.error('error loading google sheet data');
            console.dir(error);
            gaEvents.eventOccurred('sheet load failed');
            throw error;
        }
      
    }

    fetchDay(date) {
        return this.#schedule[date];
    }

    buildKey(event) {
        return(event.type + event.start + event.end + event.description);
    }

}

const schedule = new Schedule();
export { schedule }
