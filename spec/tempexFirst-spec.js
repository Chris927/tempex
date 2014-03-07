var t = require('../tempex');

var longAgo = new Date(1999, 0, 1, 6, 23, 15),
  farInTheFuture = new Date(2023, 4, 7, 11);

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
