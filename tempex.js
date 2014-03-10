(function(exports){

  var Once = function Once(when) {
    this.when = when;
  };
  Once.prototype.nextOccurrence = function(onOrAfter) {
    if (this.when >= onOrAfter) {
      return this.when;
    } else {
      return null;
    }
  };
  Once.prototype.isOccurring = function(aDate) {
    return beginningOfDay(aDate) == beginningOfDay(this.when);
  };
  exports.Once = Once;

  var OnOrAfter = function OnOrAfter(firstDay) {
    this.firstDay = firstDay;
  };
  OnOrAfter.prototype.isOccurring = function(aDate) {
    return this.firstDay <= beginningOfDay(aDate);
  };
  OnOrAfter.prototype.nextOccurrence = function(onOrAfter) {
    if (this.firstDay >= onOrAfter) {
      return this.firstDay;
    } else {
      return onOrAfter;
    }
  };
  exports.OnOrAfter = OnOrAfter;

  var OnWeekdays = exports.OnWeekdays = function OnWeekdays( /* e.g. [ 0, 2, 3 ] for Sun,Tue,Wed */ days) {
    this.days = days;
  }
  OnWeekdays.prototype.isOccurring = function(aDate) {
    var day = aDate.getDay();
    for (var i = 0; i < this.days.length; i++) {
      if (this.days[i] == day) {
        return true;
      }
    }
    return false;
  };
  OnWeekdays.prototype.nextOccurrence = function(onOrAfter) {
    var onOrAfterDay = onOrAfter.getDay();
    var daysToAdd = null;
    for (var i = 0; i < this.days.length; i++) {
      var deltaUntilDay = this.days[i] - onOrAfterDay;
      while (deltaUntilDay < 0) {
        deltaUntilDay += 7;
      }
      if (daysToAdd === null) {
        daysToAdd = deltaUntilDay;
      } else {
        daysToAdd = Math.min(daysToAdd, deltaUntilDay);
      }
    }
    return addDays(onOrAfter, daysToAdd);
  };

  var maxNextOccurrenceOf = function(expressions, onOrAfter) {
    if (onOrAfter === null) {
      throw "onOrAfter cannot be null";
    }
    var maxNext = null;
    for (var i = 0; i < expressions.length; i++) {
      var next = expressions[i].nextOccurrence(onOrAfter);
      if (next < onOrAfter) {
        throw("nextOccurrence cannot be smaller than 'onOrAfter'")
      }
      if (next === null) {
        return null; // no next occurrence for this expression, so no maxNext
      }
      if (maxNext === null || maxNext < next) {
        maxNext = next;
      }
    }
    return maxNext;
  };

  var allAreOccurringOn = function(expressions, when) {
    if (when === null) {
      return false;
    }
    for (var i = 0; i < expressions.length; i++) {
      if (!expressions[i].isOccurring(when)) {
        return false;
      }
    }
    return true;
  };

  var IntersectionOf = function IntersectionOf(expr1, expr2) {
    this.expressions = [ expr1, expr2 ];
  };
  IntersectionOf.prototype.nextOccurrence = function(onOrAfter, butNotLaterThan) {
    while (onOrAfter <= butNotLaterThan) {
      var nextOfAll = maxNextOccurrenceOf(this.expressions, onOrAfter);
      if (nextOfAll === null) {
        return null;
      }
      if (allAreOccurringOn(this.expressions, nextOfAll)) {
        return nextOfAll;
      }
      onOrAfter = addDays(nextOfAll, 1);
    }
  };
  exports.intersectionOf = function(expr1, expr2) {
    return new IntersectionOf(expr1, expr2);
  };

  var nextOccurrence = exports.nextOccurrence = function(expressions, onOrAfter, butNotLaterThan) {
    var theNext = null;
    for (var i = 0; i < expressions.length; i++) {
      var occurrence = expressions[i].nextOccurrence(onOrAfter, butNotLaterThan);
      if (occurrence && occurrence < onOrAfter) {
        throw "invalid next occurrence: " + occurrence + " is less than " + onOrAfter;
      }
      if (!theNext || occurrence && occurrence < theNext) {
        theNext = occurrence;
      }
    }
    return theNext;
  }

  var beginningOfDay = function(date) {
    var r = new Date(date);
    r.setHours(0);
    r.setMinutes(0);
    r.setSeconds(0);
    r.setMilliseconds(0);
    return r;
  }

  var addDays = function(date, days) {
    var r = new Date(date);
    r.setDate(r.getDate() + days);
    return r;
  }

  exports.occurrences = function(expressions, from, to) {
    if (!expressions || expressions.length == 0) {
      return [];
    } else {
      var result = [];
      while(from <= to) {
        occurrence = nextOccurrence(expressions, from, to);
        if(!occurrence || occurrence > to) {
          break;
        }
        result.push(occurrence);
        from = beginningOfDay(addDays(occurrence, 1));
      }
      return result;
    }
  };

  exports.helpers = {
    addDays: addDays
  };

})(typeof exports === 'undefined'? this['TempEx']={}: exports);
