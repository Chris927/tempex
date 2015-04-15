# Temporal Expressions in Javascript

[![Build Status](https://travis-ci.org/Chris927/tempex.svg?branch=master)](https://travis-ci.org/Chris927/tempex)

## Introduction

Temporal expressions allow defining and querying recurring events on calendars.
This little library roughly follows the ideas of [Martin Fowler's
article](http://martinfowler.com/apsupp/recurring.pdf) about recurring events.

Example: Races take place Wednesdays in summer (September until April, in the
Southern Hemisphere) and Saturdays in winter (May until August).

```
var t = require('tempex');

var winterMonths = t.months([4, 5, 6, 7]); // we use Javascript convention: May=4, June=5, ...
var summerMonths = t.negate(winterMonths);
var raceSchedule = t.union([
  // summer
  t.intersectionOf(
    summerMonths,
    t.onWeekdays([ 3 ]) // Wednesday=3
  ),
  // winter
  t.intersectionOf(
    winterMonths,
    t.onWeekdays([ 6 ]) // Saturdays=6
  ),
])
```

To determine the actual occurrences (days) of this schedule in a time range:

```
t.occurrences(raceSchedule, new Date(2015, 2, 1), new Date(2015, 5, 31));
```

will produce:

```
[ Wed Mar 04 2015 00:00:00 GMT+0200 (SAST),
  Wed Mar 11 2015 00:00:00 GMT+0200 (SAST),
  Wed Mar 18 2015 00:00:00 GMT+0200 (SAST),
  Wed Mar 25 2015 00:00:00 GMT+0200 (SAST),
  Wed Apr 01 2015 00:00:00 GMT+0200 (SAST),
  Wed Apr 08 2015 00:00:00 GMT+0200 (SAST),
  Wed Apr 15 2015 00:00:00 GMT+0200 (SAST),
  Wed Apr 22 2015 00:00:00 GMT+0200 (SAST),
  Wed Apr 29 2015 00:00:00 GMT+0200 (SAST),
  Sat May 02 2015 00:00:00 GMT+0200 (SAST),
  Sat May 09 2015 00:00:00 GMT+0200 (SAST),
  Sat May 16 2015 00:00:00 GMT+0200 (SAST),
  Sat May 23 2015 00:00:00 GMT+0200 (SAST),
  Sat May 30 2015 00:00:00 GMT+0200 (SAST),
  Sat Jun 06 2015 00:00:00 GMT+0200 (SAST),
  Sat Jun 13 2015 00:00:00 GMT+0200 (SAST),
  Sat Jun 20 2015 00:00:00 GMT+0200 (SAST),
  Sat Jun 27 2015 00:00:00 GMT+0200 (SAST) ]
```

If we want to express that there won't be races during the Easter holidays:

``
var holidays = t.intersectionOf( t.onOrAfter(new Date(2015, 2, 30)), t.onOrBefore(new Date(2015, 3, 17)))
var raceDays = t.intersectionOf(raceSchedule, t.negate(holidays))
``

Then

```
t.occurrences(raceDays, new Date(2015, 2, 1), new Date(2015, 5, 31))
```

will give us the occurrences:

```
[ Wed Mar 04 2015 00:00:00 GMT+0200 (SAST),
  Wed Mar 11 2015 00:00:00 GMT+0200 (SAST),
  Wed Mar 18 2015 00:00:00 GMT+0200 (SAST),
  Wed Mar 25 2015 00:00:00 GMT+0200 (SAST),
  Wed Apr 22 2015 00:00:00 GMT+0200 (SAST),
  Wed Apr 29 2015 00:00:00 GMT+0200 (SAST),
  Sat May 02 2015 00:00:00 GMT+0200 (SAST),
  Sat May 09 2015 00:00:00 GMT+0200 (SAST),
  Sat May 16 2015 00:00:00 GMT+0200 (SAST),
  Sat May 23 2015 00:00:00 GMT+0200 (SAST),
  Sat May 30 2015 00:00:00 GMT+0200 (SAST),
  Sat Jun 06 2015 00:00:00 GMT+0200 (SAST),
  Sat Jun 13 2015 00:00:00 GMT+0200 (SAST),
  Sat Jun 20 2015 00:00:00 GMT+0200 (SAST),
  Sat Jun 27 2015 00:00:00 GMT+0200 (SAST) ]
```

## API Documentation

Is [here](http://chris927.github.io/tempex/).
