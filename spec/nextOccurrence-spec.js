var t = require('../tempex');

describe("nextOccurrence", function() {
  it("gives one next occurrence for an event that occurs once", function() {
    var someDate = new Date(2014, 2, 8);
    var se = { expressions: [ t.once(someDate) ] };
    // maybe we can just pass in an array of temporal expression to nextOccurrence()?
    var next = t.nextOccurrence(se, new Date(2013, 3, 3));
    // TODO: pending
  });
});
