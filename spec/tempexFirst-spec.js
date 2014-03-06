t = require('../tempex');

describe("empty input", function() {
  it("returns an empty list of dates", function() {
    occurrences = t.occurrences(/* event */ {}, /* temp. expressions */ [], new Date(), new Date());
    expect(occurrences).toEqual([]);
  });
});
