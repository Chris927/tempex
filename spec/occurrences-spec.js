var t = require('../tempex'),
  addDays = t.helpers.addDays;

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
    occurrences = t.occurrences(/* temporal expressions */ [])
    expect(occurrences).toEqual([]);
  });
});

describe("occurring once", function() {

  it("occurrs once", function() {
    var when = new Date(2014, 2, 3, 7);
    var occurrences = t.occurrences( [ new t.Once(when) ], longAgo, farInTheFuture);
    expect(occurrences.length).toBe(1);
    expect(occurrences[0]).toEqual(when);
  });

  it("occurrs twice, with two expressions of 'Once'", function() {
    var aDay = new Date(2014, 2, 4),
      nextDay = new Date(2014, 2, 5),
      nextDayButLater = new Date(2014, 2, 5, 6);

    // gives us two occurrences
    var occurrences = t.occurrences( [ new t.Once(aDay), new t.Once(nextDay) ], longAgo, farInTheFuture);
    expect(occurrences.length).toBe(2);

    // now we have a third expression, but it falls on the same day as the second; thus we are getting
    // two occurrences, as we want to know the *DAYS* an event occurrs... if it occurs multiple times on
    // the same day is not our concern here.
    occurrences = t.occurrences( [ new t.Once(aDay),
                                   new t.Once(nextDay),
                                   new t.Once(nextDayButLater) ],
                                longAgo,
                                farInTheFuture);
    expect(occurrences.length).toBe(2);
  });

  it("respects the 'to' date given", function() {
    var aDay = new Date(2014, 6, 5), aDayLater = new Date(2014, 6, 6);
    var justBeforeTheDayLater = addMilliseconds(aDayLater, -1);
    var expressions = [ new t.Once(aDay), new t.Once(aDayLater) ];

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
      expressions = [ new t.OnWeekdays([ 1, 3 ]) ]; // should occur Mondays and Wednesdays

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

});
