var t = require('../tempex');

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
