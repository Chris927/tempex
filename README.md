# Temporal Expressions in Javascript

WARNING: Below expressions are *not* implemented yet :)

Temporal expressions allow defining and querying recurring events on calendars.

Example: Races take place Wednesdays in summer (September until April, in the
Southern Hemisphere) and Saturdays in winter (May until August).

```
var t = require('tempex');

var winterMonths = t.months(4, 5, 6, 7); // we use Javascript convention: May=4, June=5, ...
var summerMonths = winterMonths.negate();
var raceSchedule = t.union(
  // summer
  t.intersection(
    summerMonths,
    t.dayOfWeek(3) // Wednesday=3
  ),
  // winter
  t.intersection(
    winterMonths,
    t.dayOfWeek(6) // Saturdays=6
  ),
)
```

If we want to express that there won't be races during the Christmas days and
New Year, this can be added like this:

``
raceScheduleObeyingHolidays = t.difference(
  raceSchedule,
  t.union(t.dayOfYear(0, 1),
          t.dayOfYear(11, 25),
          t.dayOfYear(11, 26)));
``

We can now query the occurrences for such a schedule for the year 2014:

``
var from = new Date(2014, 0, 1),
    to = new Date(2014, 11, 31);
var occurrences = t.occurrences(raceScheduleObeyingHolidays, from, to);
``

This will yield an array of Date instances:

...
