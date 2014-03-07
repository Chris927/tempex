var t = require('../tempex');

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

describe("single event occurring once", function() {
  it("occurrs once", function() {
    var event = { title: "my test event" },
    when = new Date(2014, 2, 3, 7),
    scheduleElement = { event: event, expressions: [ new t.Once(when) ] };
    var occurrences = t.occurrences( [ new t.Once(when) ], longAgo, farInTheFuture);
    expect(occurrences.length).toBe(1);
    expect(occurrences[0]).toEqual(when);
  });
});
