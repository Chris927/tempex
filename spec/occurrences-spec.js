var t = require('../tempex'),
  addDays = t.addDays;

var addMilliseconds = function(date, millis) {
  var d = new Date(date);
  d.setMilliseconds(d.getMilliseconds() + millis);
  return d;
}

var longAgo = new Date(1999, 0, 1, 6, 23, 15),
  farInTheFuture = new Date(2023, 4, 7, 11);

describe("empty input", function() {
  it("returns an empty list of occurrences", function() {
    var occurrences = t.occurrences(/* temporal expressions */ [], /* from */ new Date(), /* to */ new Date());
    expect(occurrences).toEqual([]);
  });
});

describe("occurring once", function() {

  it("occurrs once", function() {
    var when = new Date(2014, 2, 3, 7);
    var occurrences = t.occurrences( [ t.once(when) ], longAgo, farInTheFuture);
    expect(occurrences.length).toBe(1);
    expect(occurrences[0]).toEqual(when);
  });

  it("occurrs twice, with two expressions of 'Once'", function() {
    var aDay = new Date(2014, 2, 4),
      nextDay = new Date(2014, 2, 5),
      nextDayButLater = new Date(2014, 2, 5, 6);

    // gives us two occurrences
    var occurrences = t.occurrences( [ t.once(aDay), t.once(nextDay) ], longAgo, farInTheFuture);
    expect(occurrences.length).toBe(2);

    // now we have a third expression, but it falls on the same day as the second; thus we are getting
    // two occurrences, as we want to know the *DAYS* an event occurrs... if it occurs multiple times on
    // the same day is not our concern here.
    occurrences = t.occurrences( [ t.once(aDay),
                                   t.once(nextDay),
                                   t.once(nextDayButLater) ],
                                longAgo,
                                farInTheFuture);
    expect(occurrences.length).toBe(2);
  });

  it("respects the 'to' date given", function() {
    var aDay = new Date(2014, 6, 5), aDayLater = new Date(2014, 6, 6);
    var justBeforeTheDayLater = addMilliseconds(aDayLater, -1);
    var expressions = [ t.once(aDay), t.once(aDayLater) ];

    var occurrences = t.occurrences(expressions, longAgo, farInTheFuture);
    expect(occurrences.length).toBe(2);

    occurrences = t.occurrences(expressions, longAgo, justBeforeTheDayLater);
    expect(occurrences.length).toBe(1);

  });

});

describe("other temporal expressions", function() {

  var expressions;

  describe("on specific days of the week", function() {

    var now = new Date(2013, 6, 8) /* a Monday */,
        nextSunday = new Date(2013, 6, 14);

    it("allows certain weekdays", function() {
      expressions = [ t.onWeekdays([ 1, 3 ]) ]; // should occur Mondays and Wednesdays

      // between now (Monday) and Sunday...
      var occurrences = t.occurrences(expressions, now, nextSunday);
      // there are two occurrences
      expect(occurrences.length).toBe(2);
      expect(occurrences[0]).toEqual(now);
      expect(occurrences[0].getDay()).toEqual(1);
      expect(occurrences[1]).toEqual(addDays(now, 2));
      expect(occurrences[1].getDay()).toEqual(3);

      // between today and coming Monday...
      occurrences = t.occurrences(expressions, now, addDays(now, 7));
      // it should occur thrice
      expect(occurrences.length).toBe(3);
      expect(occurrences[0]).toEqual(now);
      expect(occurrences[1]).toEqual(addDays(now, 2));
      expect(occurrences[2]).toEqual(addDays(now, 7));

      // between today and today (ahem)...
      occurrences = t.occurrences(expressions, now, now);
      // there is one occurrence
      expect(occurrences.length).toBe(1);

      // between tomorrow and Sunday...
      occurrences = t.occurrences(expressions, addDays(now, 1), nextSunday);
      // there is one occurrence (Wednesday)
      expect(occurrences.length).toBe(1);
      expect(occurrences[0]).toEqual(addDays(now, 2));

      // between today and Sunday in two weeks...
      occurrences = t.occurrences(expressions, now, addDays(nextSunday, 7));

      // should occur 4 times, i.e. Mon and Wed in both weeks from now
      expect(occurrences.length).toBe(4);
      expect(occurrences[0]).toEqual(now);
      expect(occurrences[1]).toEqual(addDays(now, 2));
      expect(occurrences[2]).toEqual(addDays(now, 7));
      expect(occurrences[3]).toEqual(addDays(now, 9));

    });
  });

  describe("before a specific day", function() {

    var now = new Date(2013, 6, 27)
        twentyTwoDaysLater = addDays(now, 22);

    it("covers all days in the range, if the specified day is after the range", function() {
      var occurrences = t.occurrences([ t.onOrBefore(addDays(twentyTwoDaysLater, 2)) ], now, twentyTwoDaysLater);
      expect(occurrences.length).toBe(23);
      expect(occurrences[0]).toEqual(now);
      expect(occurrences[22]).toEqual(twentyTwoDaysLater);
    });

    it("occurs once, if the day is the first day of the range", function() {
      var occurrences = t.occurrences([ t.onOrBefore(now) ], now, twentyTwoDaysLater);
      expect(occurrences.length).toBe(1);
      expect(occurrences[0]).toEqual(now);
    });

    it("does not occur, if the day is before the range", function() {
      var occurrences = t.occurrences([ t.onOrBefore(addDays(now, -1)) ], now, twentyTwoDaysLater);
      expect(occurrences.length).toBe(0);
    });

  });

  describe("after a specific day", function() {

    var now = new Date(2013, 6, 27)
        twentyTwoDaysLater = addDays(now, 22);

    it("covers all days in the range, if the specified day is before the range", function() {
      var occurrences = t.occurrences([ t.onOrAfter(addDays(now, -2)) ], now, twentyTwoDaysLater);
      expect(occurrences.length).toBe(23);
      expect(occurrences[0]).toEqual(now);
      expect(occurrences[22]).toEqual(twentyTwoDaysLater);
    });

    it("occurs once, if the day is the last day of the range", function() {
      var occurrences = t.occurrences([ t.onOrAfter(twentyTwoDaysLater) ], now, twentyTwoDaysLater);
      expect(occurrences.length).toBe(1);
      expect(occurrences[0]).toEqual(twentyTwoDaysLater);
    });

    it("does not occur, if the day is past the range", function() {
      var occurrences = t.occurrences([ t.onOrAfter(addDays(twentyTwoDaysLater, 1)) ], now, twentyTwoDaysLater);
      expect(occurrences.length).toBe(0);
    });

  });

  describe("before and after combined", function() {
    var now = new Date(2013, 6, 27),
        threeDaysLater = addDays(now, 3),
        sixDaysLater = addDays(now, 6),
        twentyTwoDaysLater = addDays(now, 22);

    it("covers all days in the range, if the specified day is before the range", function() {
      var expr = t.onOrAfter(threeDaysLater);
      expr = t.intersectionOf(expr, t.onOrBefore(sixDaysLater));
      var occurrences = t.occurrences([ expr ], now, twentyTwoDaysLater);
      expect(occurrences.length).toBe(4);
      expect(occurrences[0]).toEqual(threeDaysLater);
      expect(occurrences[3]).toEqual(sixDaysLater);
    });

  });

  describe("on specific dates", function() {
    var now = new Date(2014, 3, 3), tomorrow = addDays(now, 1), inTwoWeeks = addDays(now, 14);
    it("occurrs on those days", function() {
      var expression = t.onSpecificDates( [ tomorrow ]);
      var occurrences = t.occurrences([ expression ], now, inTwoWeeks);
      expect(occurrences.length).toEqual(1);
      expect(occurrences[0]).toEqual(tomorrow);
    });
  });

  describe("not on specific dates", function() {
    var now = new Date(2014, 3, 3), inTwoWeeks = addDays(now, 14);
    it("occurrs on all other days", function() {
      var expression = t.notOnSpecificDates( [ new Date(2014, 3, 4) ]);
      var occurrences = t.occurrences([ expression ], now, inTwoWeeks);
      expect(occurrences.length).toEqual(14);
      expect(occurrences[0]).toEqual(now);
      expect(occurrences[1]).toEqual(addDays(now, 2));
    });
  });

  describe("on specific months", function() {
    var now = new Date(2014, 3, 3), inOneYear = addDays(now, 365);

    it("occurrs on the months specified", function() {
      var expression = t.months([2, 3]);
      occurrences = t.occurrences([ expression ], now, inOneYear);
      expect(occurrences.length).toEqual(62);
      expect(occurrences[0]).toEqual(now);
      expect(occurrences[1]).toEqual(new Date(2014, 3, 4));
      expect(occurrences[27]).toEqual(new Date(2014, 3, 30)); // until end of April this year
      expect(occurrences[28]).toEqual(new Date(2015, 2, 1)); // ... and all of March next year
      expect(occurrences[58]).toEqual(new Date(2015, 2, 31));
      expect(occurrences[59]).toEqual(new Date(2015, 3, 1)); // ... and the first three days of April next year
      expect(occurrences[61]).toEqual(new Date(2015, 3, 3));
    });
  });

  describe("every n-th week", function() {
    var now = new Date(2013, 11, 15), oneYearFromNow = addDays(now, 365);
    it("matches every day (for n == 1)", function() {
      var expression = t.everyNthWeekFrom(1, new Date(2013, 11, 15));
      occurrences = t.occurrences([ expression ], now, oneYearFromNow);
      expect(occurrences.length).toEqual(366); // every day
    })
    it("matches every 2nd week", function() {
      var expression = t.everyNthWeekFrom(2, new Date(2013, 11, 15));
      occurrences = t.occurrences([ expression ], now, oneYearFromNow);
      expect(occurrences.length).toEqual(184);
      expect(occurrences[0]).toEqual(new Date(2013, 11, 15)); // every day of week 0
      expect(occurrences[1]).toEqual(new Date(2013, 11, 16));
      expect(occurrences[2]).toEqual(new Date(2013, 11, 17));
      expect(occurrences[3]).toEqual(new Date(2013, 11, 18));
      expect(occurrences[4]).toEqual(new Date(2013, 11, 19));
      expect(occurrences[5]).toEqual(new Date(2013, 11, 20));
      expect(occurrences[6]).toEqual(new Date(2013, 11, 21)); // ... then no day of week 1
      expect(occurrences[7]).toEqual(new Date(2013, 11, 29)); // then all days of week 2
      expect(occurrences[8]).toEqual(new Date(2013, 11, 30));
      expect(occurrences[9]).toEqual(new Date(2013, 11, 31));
      expect(occurrences[10]).toEqual(new Date(2014, 0, 1));
      expect(occurrences[11]).toEqual(new Date(2014, 0, 2));
      expect(occurrences[12]).toEqual(new Date(2014, 0, 3));
      expect(occurrences[13]).toEqual(new Date(2014, 0, 4));
    });
    it("matches every 2nd week", function() {
      var expression = t.everyNthWeekFrom(3, new Date(2013, 11, 15));
      occurrences = t.occurrences([ expression ], now, oneYearFromNow);
      expect(occurrences.length).toEqual(126);
      expect(occurrences[0]).toEqual(new Date(2013, 11, 15)); // every day of week 0
      expect(occurrences[1]).toEqual(new Date(2013, 11, 16));
      expect(occurrences[2]).toEqual(new Date(2013, 11, 17));
      expect(occurrences[3]).toEqual(new Date(2013, 11, 18));
      expect(occurrences[4]).toEqual(new Date(2013, 11, 19));
      expect(occurrences[5]).toEqual(new Date(2013, 11, 20));
      expect(occurrences[6]).toEqual(new Date(2013, 11, 21));
      expect(occurrences[7]).toEqual(new Date(2014, 0, 5)); // ... then all days of week 3
      expect(occurrences[8]).toEqual(new Date(2014, 0, 6)); // ... and so on
    });
  });

  describe("on specific day of the month", function() {

    var now = new Date(2013, 11, 15), oneYearFromNow = addDays(now, 365);

    it("matches the first of the month", function() {
      var expression = t.dayInMonth(1);
      var occurrences = t.occurrences([ expression ], now, oneYearFromNow);
      expect(occurrences.length).toBe(12);
      expect(occurrences[0]).toEqual(new Date(2014, 0, 1));
      expect(occurrences[1]).toEqual(new Date(2014, 1, 1));
      expect(occurrences[11]).toEqual(new Date(2014, 11, 1));
    });

    it("matches the last of the month", function() {
      var expression = t.dayInMonth(31);
      var occurrences = t.occurrences([ expression ], now, oneYearFromNow);
      expect(occurrences.length).toBe(12);
      expect(occurrences[0]).toEqual(new Date(2013, 11, 31));
      expect(occurrences[1]).toEqual(new Date(2014, 0, 31));
      expect(occurrences[2]).toEqual(new Date(2014, 1, 31)); // this is actually March 3rd 2014!
      expect(occurrences[3]).toEqual(new Date(2014, 2, 31));
      expect(occurrences[11]).toEqual(new Date(2014, 10, 31)); // this is the 1st of Dec 2014!
    });

  });

  describe("on specific n-th weekday of the month", function() {

    var now = new Date(2013, 11, 15) /* a Sunday */, oneYearFromNow = addDays(now, 365);

    it("matches the first Monday of the month", function() {
      var expression = t.dayOfWeekInMonth(1 /* Monday */, 1 /* the first one */);
      var occurrences = t.occurrences([ expression ], now, oneYearFromNow);
      expect(occurrences.length).toBe(12);
      expect(occurrences[0]).toEqual(new Date(2014, 0, 6));
      expect(occurrences[1]).toEqual(new Date(2014, 1, 3));
      expect(occurrences[2]).toEqual(new Date(2014, 2, 3));
      expect(occurrences[3]).toEqual(new Date(2014, 3, 7));
      expect(occurrences[4]).toEqual(new Date(2014, 4, 5));
      expect(occurrences[5]).toEqual(new Date(2014, 5, 2));
      expect(occurrences[6]).toEqual(new Date(2014, 6, 7));
      expect(occurrences[7]).toEqual(new Date(2014, 7, 4));
      expect(occurrences[8]).toEqual(new Date(2014, 8, 1));
      expect(occurrences[9]).toEqual(new Date(2014, 9, 6));
      expect(occurrences[10]).toEqual(new Date(2014, 10, 3));
      expect(occurrences[11]).toEqual(new Date(2014, 11, 1));
    });

    it("matches the 3rd Saturday", function() {
      var expression = t.dayOfWeekInMonth(6 /* Sat */, 3 /* the third*/);
      var beginningOfMonth = new Date(2015, 1, 1) /* a Sunday */,
          endOfMonth = new Date(2015, 1, 28);
      occurrences = t.occurrences([ expression ], beginningOfMonth, endOfMonth);
      expect(occurrences.length).toBe(1);
      expect(occurrences[0]).toEqual(new Date(2015, 1, 21));
    });

  });

  describe("unions", function() {

    var now = new Date(2015, 2, 26), // a Thursday
        twoWeeksFromNow = addDays(now, 14);

    it("occurs on all Wednesdays and every day from two weeks from now", function() {
      var expressions = [ t.onWeekdays([3]), t.onOrAfter(twoWeeksFromNow) ];
      var occurrences = t.occurrences( expressions, now, addDays(twoWeeksFromNow, 6));
      expect(occurrences.length).toBe(9);
      expect(occurrences[0]).toEqual(new Date(2015, 3, 1)); // next week Wednesday
      expect(occurrences[1]).toEqual(new Date(2015, 3, 8)); // ... and the Wednesday after that
      expect(occurrences[2]).toEqual(twoWeeksFromNow);
      expect(occurrences[3]).toEqual(addDays(twoWeeksFromNow, 1));
      expect(occurrences[4]).toEqual(addDays(twoWeeksFromNow, 2));
      expect(occurrences[5]).toEqual(addDays(twoWeeksFromNow, 3));
      expect(occurrences[6]).toEqual(addDays(twoWeeksFromNow, 4));
      expect(occurrences[7]).toEqual(addDays(twoWeeksFromNow, 5));
      expect(occurrences[8]).toEqual(addDays(twoWeeksFromNow, 6)); // that's the last day of the range, and another Wednesday
    });

  });

  describe("intersections", function() {

    var now = new Date(2014, 7, 2), // a Saturday
        inTwoWeeks = addDays(now, 14),
        inFourWeeks = addDays(inTwoWeeks, 14);

    it("ensure occurrences when both temporal expressions occur", function() {
      var fromTwoWeeks = t.onOrAfter(inTwoWeeks),
          saturdaysAndSundays = t.onWeekdays( [ 6, 0 ]);
      var intersection = t.intersectionOf(fromTwoWeeks, saturdaysAndSundays);
      var occurrences = t.occurrences( [ intersection ], now, inFourWeeks);
      expect(occurrences.length).toBe(5);
      expect(occurrences[0]).toEqual(inTwoWeeks);
      expect(occurrences[1]).toEqual(addDays(inTwoWeeks, 1));
      expect(occurrences[2]).toEqual(addDays(inTwoWeeks, 7));
      expect(occurrences[3]).toEqual(addDays(inTwoWeeks, 8));
      expect(occurrences[4]).toEqual(addDays(inTwoWeeks, 14));
    });

    it("produces an empty list of occurrences if there is no overlap", function() {
      var mondaysAndTuesdays = t.onWeekdays([ 1, 2 ]),
          saturdaysAndSundays = t.onWeekdays( [ 6, 0 ]);
        var intersection = t.intersectionOf(mondaysAndTuesdays, saturdaysAndSundays);
        var occurrences = t.occurrences( [ intersection ], now, inFourWeeks);
        expect(occurrences.length).toBe(0);
    });

    it("allows intersection of 'notOnSpecificDates' with 'weekdays'", function() {
      var today = new Date(2014, 5, 2),
          comingThursday = addDays(today, 3),
          comingFriday = addDays(today, 4),
          comingSaturday = addDays(today, 5),
          inTwoWeeks = addDays(today, 14);
      var thursdaysAndFridays = t.onWeekdays( [ 4, 5 ]);
      var notComingThursday = t.notOnSpecificDates( [ today, comingThursday, comingSaturday ]);
      var intersection = t.intersectionOf(thursdaysAndFridays, notComingThursday);
      var occurrences = t.occurrences( [ intersection ], today, inTwoWeeks);
      expect(occurrences[0]).toEqual(comingFriday);
      expect(occurrences[1]).toEqual(addDays(comingThursday, 7));
      expect(occurrences[2]).toEqual(addDays(comingFriday, 7));
      expect(occurrences.length).toBe(3);
    });
  });

});
