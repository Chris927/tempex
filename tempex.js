(function(exports){

  var Once = function(when) {
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

  var DailyAfter = function(firstDay) {
    this.firstDay = firstDay;
  };
  DailyAfter.isOccurring = function(aDate) {
    return this.firstDay >= beginningOfDay(aDate);
  };
  DailyAfter.prototype.nextOccurrence = function(onOrAfter) {
    if (this.firstDay >= onOrAfter) {
      return onOrAfter;
    } else {
      return this.firstDay;
    }
  };
  exports.DailyAfter = DailyAfter;

  var OnWeekdays = exports.OnWeekdays = function( /* e.g. [ 0, 2, 3 ] for Sun,Tue,Wed */ days) {
    this.days = days;
  }
  OnWeekdays.prototype.isOccurring = function(aDate) {
    var day = aDate.getDate();
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

  var nextOccurrence = exports.nextOccurrence = function(expressions, onOrAfter) {
    var theNext = null;
    for (var i = 0; i < expressions.length; i++) {
      var occurrence = expressions[i].nextOccurrence(onOrAfter);
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
        occurrence = nextOccurrence(expressions, from);
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
