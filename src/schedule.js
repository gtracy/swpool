import scheduleData from './schedule.json';
import { gaEvents } from './analytics';

class Schedule {
    #schedule = scheduleData;

    async loadSchedule() {
        gaEvents.eventOccurred('load local schedule');
        return this.#schedule;
    }

    fetchDay(date) {
        return this.#schedule[date];
    }

    buildKey(event) {
        return (event.type + event.start + event.end + event.description);
    }
}

const schedule = new Schedule();
export { schedule };

