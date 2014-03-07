var t = require('../tempex');

var longAgo = new Date(1999, 0, 1, 6, 23, 15),
  farInTheFuture = new Date(2023, 4, 7, 11);

describe("empty input", function() {
  it("returns an empty list of occurrences", function() {
    var occurrences = t.occurrences(/* schedule elements */ [], new Date(), new Date());
    expect(occurrences).toEqual([]);
  });
});

describe("singular event", function() {
  it("occurrs once", function() {
    var event = { title: "my test event" },
    when = new Date(2014, 2, 3, 7),
    scheduleElement = { event: event, expressions: [ new t.Once(when) ] };
    var occurrences = t.occurrences(scheduleElement, longAgo, farInTheFuture);
    expect(occurrences.length).toBe(1);
  });
});
