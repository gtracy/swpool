const fs = require('fs');
const path = require('path');
const moment = require('moment');

const CSV_PATH = path.join(__dirname, '../2026-ShorewoodPool-Schedule.csv');
const OUTPUT_PATH = path.join(__dirname, '../src/schedule.json');

// Target Range: May 30, 2026 to September 1, 2026
const START_LIMIT = moment('2026-05-30', 'YYYY-MM-DD');
const END_LIMIT = moment('2026-09-01', 'YYYY-MM-DD');

function parseCSVLine(line) {
  // Simple CSV parser that handles commas inside quotes or just standard fields
  // Since we inspected the file and there are no escaped quotes, but there may be simple commas,
  // we can split by comma. If there are more than 7 fields, the remaining fields belong to "Notes".
  const parts = line.split(',');
  if (parts.length <= 7) {
    return parts;
  }
  const result = parts.slice(0, 6);
  result.push(parts.slice(6).join(','));
  return result;
}

function parsePeriod(periodStr) {
  // Possible formats:
  // "May 23 - June 12"
  // "July 4"
  // "September 1 - Closing"
  const cleanStr = periodStr.trim();
  if (cleanStr.includes('-')) {
    const [startPart, endPart] = cleanStr.split('-').map(s => s.trim());
    const startDate = moment(`${startPart} 2026`, 'MMMM D YYYY');
    
    let endDate;
    if (endPart.toLowerCase() === 'closing') {
      endDate = moment('2026-09-01', 'YYYY-MM-DD'); // User specified closing date is Sept 1, 2026
    } else {
      endDate = moment(`${endPart} 2026`, 'MMMM D YYYY');
    }
    
    return { start: startDate, end: endDate };
  } else {
    // Single date like "July 4"
    const date = moment(`${cleanStr} 2026`, 'MMMM D YYYY');
    return { start: date, end: date };
  }
}

function getDaysOfWeekList(dowStr) {
  const cleanStr = dowStr.trim().toLowerCase();
  
  if (cleanStr === 'daily') {
    return ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  }
  if (cleanStr === 'monday - friday') {
    return ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  }
  if (cleanStr === 'monday - thursday') {
    return ['monday', 'tuesday', 'wednesday', 'thursday'];
  }
  if (cleanStr === 'mon / wed') {
    return ['monday', 'wednesday'];
  }
  if (cleanStr === 'tue / thu') {
    return ['tuesday', 'thursday'];
  }
  if (cleanStr === 'm-w-f') {
    return ['monday', 'wednesday', 'friday'];
  }
  if (cleanStr === 'saturday') {
    return ['saturday'];
  }
  if (cleanStr === 'sunday') {
    return ['sunday'];
  }
  if (cleanStr === 'friday') {
    return ['friday'];
  }
  if (cleanStr === 'monday') {
    return ['monday'];
  }
  
  console.warn(`Unknown Day of Week pattern: ${dowStr}`);
  return [];
}

function compile() {
  const content = fs.readFileSync(CSV_PATH, 'utf-8');
  const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
  
  // Remove header
  const header = lines.shift();
  
  const schedule = {};
  
  // Pre-populate days in target range
  let current = moment(START_LIMIT);
  while (current.isSameOrBefore(END_LIMIT)) {
    schedule[current.format('YYYY-MM-DD')] = { events: [] };
    current.add(1, 'day');
  }
  
  lines.forEach((line) => {
    const fields = parseCSVLine(line);
    if (fields.length < 6) return;
    
    const [periodStr, dowStr, type, startTime, endTime, description, notes] = fields;
    
    const period = parsePeriod(periodStr);
    const dows = getDaysOfWeekList(dowStr);
    
    // Iterate over each date in the period
    let d = moment(period.start);
    while (d.isSameOrBefore(period.end)) {
      const formattedDate = d.format('YYYY-MM-DD');
      const dayOfWeekName = d.format('dddd').toLowerCase();
      
      // Check if this date falls within our overall target range and matches day of week
      const isSept1ClosingSpecial = periodStr.trim() === "September 1 - Closing" && formattedDate === "2026-09-01";
      if (schedule[formattedDate] && (dows.includes(dayOfWeekName) || isSept1ClosingSpecial)) {
        schedule[formattedDate].events.push({
          dow: dayOfWeekName,
          type: type.trim().toLowerCase().replace(/\s*\/\s*/g, ''), // normalize type, e.g. "lap / open" -> "lapopen" or keep simple?
          // Let's check classes: useStyles has "family", "open", "programming", "team", "old", "aerobics", "ballet".
          // Wait, let's normalize Type values to class names in the app!
          // Let's map type to a standard type name.
          // Types in CSV: "Open", "Programming", "Lap / Open", "Special".
          // Let's check what classes are in Event.js:
          // announce, family, open, programming, team, old, aerobics, ballet.
          // Wait, we can map:
          // - Description: "Adult swim" or "Adult lap swim" or "Open swim" or "Family swim" or "Water Aerobics"
          // Let's write a simple helper to match the type in the component or we can map it here.
          // Let's keep the raw type or map it to match existing Event.js classes.
          // Let's see how Event.js assigns class names:
          // const className = classes[eventDetails.type];
          // We can normalize `type` to match classes.
          // "Open" -> "open"
          // "Programming" -> "programming"
          // "Lap / Open" -> Let's check what css class fits "Lap / Open".
          // Wait! In Event.js:
          // open: border: '1px solid #679436'
          // family: border: '1px solid #a9bcd0'
          // programming: border: '1px solid #427aa1'
          // aerobics: border: '1px solid #bb4430'
          // ballet: border: '1px solid #ff6392'
          // Let's map "Lap / Open" to "open" or "programming" or we can create map rules:
          // If description contains "aerobics", type = "aerobics"
          // If description contains "ballet", type = "ballet"
          // If description contains "family", type = "family"
          // If description contains "lap", type = "open" (or we can add "lap" class or map to "open")
          // Let's look at the mapping logic in the CSV parser.
          rawType: type.trim(),
          start: startTime.trim(),
          end: endTime.trim(),
          description: description.trim(),
          notes: (notes || '').trim()
        });
      }
      d.add(1, 'day');
    }
  });

  // Post-process: map types to CSS classes and sort events chronologically
  Object.keys(schedule).forEach((dateStr) => {
    schedule[dateStr].events.forEach((evt) => {
      const desc = evt.description.toLowerCase();
      const raw = evt.rawType.toLowerCase();
      
      let finalType = 'open';
      if (desc.includes('aerobics')) {
        finalType = 'aerobics';
      } else if (desc.includes('ballet')) {
        finalType = 'ballet';
      } else if (desc.includes('family')) {
        finalType = 'family';
      } else if (desc.includes('team') || desc.includes('lesson') || desc.includes("master's") || raw === 'programming') {
        finalType = 'programming';
      } else if (raw === 'open' || raw === 'lap / open' || raw === 'special') {
        finalType = 'open';
      }
      
      evt.type = finalType;
      delete evt.rawType;
    });

    // Sort events
    schedule[dateStr].events.sort((a, b) => {
      const startTimeA = moment(a.start, 'hh:mm A');
      const startTimeB = moment(b.start, 'hh:mm A');
      return startTimeA.diff(startTimeB);
    });
  });

  // Post-process refinement: clean up future/irrelevant notes and remove non-running events
  Object.keys(schedule).forEach((dateStr) => {
    const d = moment(dateStr, 'YYYY-MM-DD');
    const dayOfWeekName = d.format('dddd').toLowerCase();
    const refinedEvents = [];

    const isAfter730PM = (timeStr) => {
      return moment(timeStr, "h:mm A").isAfter(moment("7:30 PM", "h:mm A"));
    };

    const isAfter830PM = (timeStr) => {
      return moment(timeStr, "h:mm A").isAfter(moment("8:30 PM", "h:mm A"));
    };

    schedule[dateStr].events.forEach((event) => {
      let keepEvent = true;
      let notes = event.notes || '';
      let end = event.end;

      // Capping rule: "end" property on every event for every date is never later than 8:30 PM
      if (isAfter830PM(end)) {
        end = "8:30 PM";
      }

      // 1. Wading pool restriction in June
      if (notes.includes("June 1-4 & 8-11: portion restricted 5-7 PM for Swim/Dive practice")) {
        const isRestrictedDate = 
          (dateStr >= "2026-06-01" && dateStr <= "2026-06-04") ||
          (dateStr >= "2026-06-08" && dateStr <= "2026-06-11");
        if (isRestrictedDate) {
          notes = "Wading pool open. Portion restricted 5-7 PM for Swim/Dive practice (short course format)";
        } else {
          notes = "Wading pool open";
        }
      }

      // 2. Water Aerobics TBD
      if (notes.includes("Starting after June 7th TBD")) {
        if (dateStr <= "2026-06-07") {
          keepEvent = false;
        } else {
          notes = "TBD";
        }
      }

      // 3. Adult lap swim in June (June 13 - June 28)
      if (notes.includes("Long course (M W F 1-lane); Short course (T Th 1-3 lanes)")) {
        if (['monday', 'wednesday', 'friday'].includes(dayOfWeekName)) {
          notes = "Long course (1-lane)";
        } else if (['tuesday', 'thursday'].includes(dayOfWeekName)) {
          notes = "Short course (1-3 lanes)";
        }
      }

      // 4. Adult lap swim in July (July 5 - July 26)
      if (notes.includes("Long course (M W 1-lane); Short course (T 1-3 lanes)") && !notes.includes("NO TH/FR")) {
        if (['monday', 'wednesday'].includes(dayOfWeekName)) {
          notes = "Long course (1-lane)";
        } else if (dayOfWeekName === 'tuesday') {
          notes = "Short course (1-3 lanes)";
        } else if (dayOfWeekName === 'thursday') {
          keepEvent = false;
        }
      }

      // 5. Adult lap swim in late July (July 27 - July 31)
      if (notes.includes("Long course (M W 1-lane); Short course (T 1-3 lanes); NO TH/FR")) {
        if (['monday', 'wednesday'].includes(dayOfWeekName)) {
          notes = "Long course (1-lane)";
        } else if (dayOfWeekName === 'tuesday') {
          notes = "Short course (1-3 lanes)";
        } else if (['thursday', 'friday'].includes(dayOfWeekName)) {
          keepEvent = false;
        }
      }

      // 6. Closes at 7:30 PM on Mondays
      if (notes.includes("Closes at 7:30 PM on Mondays")) {
        if (dayOfWeekName === 'monday') {
          if (isAfter730PM(end)) {
            end = "7:30 PM";
          }
          notes = notes.replace("Closes at 7:30 PM on Mondays", "Closes at 7:30 PM").trim();
          notes = notes.replace(/^;\s*|\s*;\s*$/, '').replace(/;\s*;/, ';').trim();
        } else {
          notes = notes.replace("Closes at 7:30 PM on Mondays", "").trim();
          notes = notes.replace(/^;\s*|\s*;\s*$/, '').trim();
        }
      }

      // 7. Closes at 7:30 PM on Monday 6/29
      if (notes.includes("Closes at 7:30 PM on Monday 6/29")) {
        if (dateStr === "2026-06-29") {
          if (isAfter730PM(end)) {
            end = "7:30 PM";
          }
          notes = "Closes at 7:30 PM";
        } else {
          notes = "";
        }
      }

      if (keepEvent) {
        event.notes = notes;
        event.end = end;
        refinedEvents.push(event);
      }
    });

    schedule[dateStr].events = refinedEvents;
  });
  
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(schedule, null, 2));
  console.log(`Successfully compiled schedule to ${OUTPUT_PATH}. Total days: ${Object.keys(schedule).length}`);
}

compile();
